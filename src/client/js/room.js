import { elementOpen, elementClose, elementVoid } from "wabi"

export class Room {
    constructor() {
        this.x = 0
        this.y = 0
        this.edgesFrom = []
        this.edgesTo = []
        this.limit = 4
        this.roomNode = null
    }
    /**
     * Checks if room has all edges generated but no entry edge or no exit edges
    **/
    checkRoom () {
        // All edges for node are generated...
        return (this.limit == this.edgesFrom.length + this.edgesTo.length)
            &&
            (
                // ...but node has no enter or exit edge
                this.edgesFrom.length == 0 || this.edgesTo.length == 0
            )
    }

    render(x, y) {
        let classes = ["tdw", "rdw", "bdw", "ldw"]
        this.edgesTo.map(edge => {
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
        this.edgesFrom.map(edge => {
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
        elementOpen("div", {class: "room " + classes.join(" ")})
            elementVoid("div", {class: "t"})
            elementVoid("div", {class: "r"})
            elementVoid("div", {class: "b"})
            elementVoid("div", {class: "l"})
        elementClose("div")
    }
}
