import { elementOpen, elementClose, elementVoid } from "wabi"
import { Room } from "./room.js"
import { fix, shuffle, randomElement } from "./utils.js"

export class Maze {
	constructor(n) {
		this.size = n
	}
	reset() {
		let n = this.size
		this.maze = Array(n).fill(null).map(_ =>
            Array(n).fill(null).map(_ =>new Room())
        )

        // Limits define how much edges can node have
        // Two for corner nodes
        this.maze[0][0].limit     = 2
        this.maze[0][n-1].limit   = 2
        this.maze[n-1][0].limit   = 2
        this.maze[n-1][n-1].limit = 2

        // Three for sode nodes
        for (let i=1; i<n-1; i++) {
            this.maze[0][i].limit   = 3
            this.maze[n-1][i].limit = 3
            this.maze[i][0].limit   = 3
            this.maze[i][n-1].limit = 3
        }

        // Update coordinates for each node
        for (let i=0; i<n; i++) {
            for (let j=0; j<n; j++) {
                this.maze[i][j].x=j
                this.maze[i][j].y=i
            }
        }
	}

	generateMaze() {
		let n = this.size
		this.reset()
        // We generate loops or clusters using ramdom coordinates
        let coords = [...Array(n*n).keys()].map(x => [Math.floor(x/n), x%n])
        shuffle(coords)

        for (let i in coords) {
            let y = coords[i][0]
            let x = coords[i][1]

            this.makeEdge({x:x, y:y}, {x:x, y:y}, [], 0)

            if (!this.checkMaze(this.maze)) {
                return false
            }
        }

        // Additional walktrough to complete all edges
        // This check is needed in rare cases
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                let room = this.maze[y][x]
                if (room.limit != room.edgesFrom.length + room.edgesTo.length) {
                    this.makeEdge({x:x, y:y}, {x:x, y:y}, [], 0)
                    if (!this.checkMaze(this.maze)) {
                        return false
                    }
                    if (x == 0 && y == 0) {
                        return false
                    }
                    x = y = 0
                }
            }
        }
		return true
        /*
        if (!walkMaze(maze)) {
            return false;
        }
        */

    }
	/**
     * Generates an edge between current node and one of neighbour nodes.
     * Verifies if generator went in dead loop
    **/
    makeEdge(current, start, path, newNodes, debug) {
        try {
            const x = current.x
            const y = current.y
            const currentNode = this.maze[y][x]

            // All neighbour nodes that are next to current by horizontal or vertical line
            const nodes = [
                this.maze[y][x-1] || false,
                this.maze[y][x+1] || false,
                this.maze[y-1] && this.maze[y-1][x] || false,
                this.maze[y+1] && this.maze[y+1][x] || false
            ].filter(Boolean)

            // All nodes that are not connected to current
            // and have reserve to connect
            const unconnected = nodes
                .filter(e => e.limit - e.edgesFrom.length - e.edgesTo.length > 0)
                .filter(e => !e.edgesFrom.find(e => e.x == x && e.y == y))
                .filter(e => !e.edgesTo.find(e => e.x == x && e.y == y))

            // Make new edge
            if (debug) {
                console.log(JSON.stringify(nodes), JSON.stringify(unconnected))
            }

            if (unconnected.length > 0) {
                let node = randomElement(unconnected)

                // Can make edge from current node to random node
                if (currentNode.limit - currentNode.edgesTo.length > 0) {
                    currentNode.edgesTo.push({x:node.x, y:node.y})
                    this.maze[node.y][node.x].edgesFrom.push({x:x, y:y})
                    start = {x:node.x, y:node.y}
                }

                // Can make edge from random node to current node
                else if (currentNode.limit - currentNode.edgesFrom.length > 1) {
                    currentNode.edgesFrom.push({x:node.x, y:node.y})
                    this.maze[node.y][node.x].edgesTo.push({x:x, y:y})
                }

                // Not possible to make new door. Something went wrong
                else {
                    return false
                }

                // Remember how much nodes we have generated
                newNodes++
                // Reset deadloop tracker
                path = []
            }

            // Make a step over existing edge
            else {
                let node = randomElement(currentNode.edgesTo)

                // No possible node to connect OR
                // no new edges generated during whole walk (or deadloop)
                if (!node || newNodes == 0 && this.checkPath(node, path)) {
                    return false;
                }

                // Save node in deadloop tracker
                path.push(node)
                newNodes = 0
            }

            // Recursively generate new edge
            return this.makeEdge({x:node.x, y:node.y}, start, path, newNodes)
        }
        catch (e) {
            // When recursion overflows graph should be regenerated
            return false
        }

    }
	/**
     * Checks if graph is completed and is strongly connected
    **/
    checkMaze(maze) { 
		return maze.reduce(
			(acc, row) => acc && row.reduce(
				(bcc, node) => bcc && !this.checkRoom(node)
			)
		)
	}
    /**
     * Checks if room has all edges generated but no entry edge or no exit edges
    **/
    checkRoom (room) {
        // All edges for node are generated...
    	return (room.limit == room.edgesFrom.length + room.edgesTo.length)
			&&
			(
				// ...but node has no enter or exit edge
				room.edgesFrom.length == 0 || room.edgesTo.length == 0
			)
	}
	/**
     * Checks if generator stuck in deadloop
    **/
    checkPath(node, path) {
		return path.reduce((acc, elem) => acc || elem.x == node.x && elem.y == node.y)
	}

	render() {
        const mazeNode = document.querySelector('.maze')
        this.maze.map((row, y) => {

			elementOpen("div", {class: "row"})
            row.map((room, x) => {
                const classes = ["tdw", "rdw", "bdw", "ldw"]
                room.edgesTo.map(edge => {
                    if (edge.x == x) {
                        (edge.y > y)
                            ? classes[2] = "bdd"
                            : classes[0] = "tdu"
                    }
                    else {
                        (edge.x > x)
                            ? classes[1] = "rdr"
                            : classes[3] = "ldl"
                    }
                })
                room.edgesFrom.map(edge => {
                    if (edge.x == x) {
                        (edge.y > y)
                            ? classes[2] = "bdu"
                            : classes[0] = "tdd"
                    }
                    else {
                        (edge.x > x)
                            ? classes[1] = "rdl"
                            : classes[3] = "ldr"
                    }
                })
                const roomNode = document.createElement('div')
                roomNode.className = "room " + classes.join(" ")
				elementOpen("div", {class: "room " + classes.join(" ")})
					elementVoid("div", {class: "t"})
					elementVoid("div", {class: "r"})
					elementVoid("div", {class: "b"})
					elementVoid("div", {class: "l"})
				elementClose("div")
            })
			elementClose("div")
        })
    }

}
