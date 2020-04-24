import { component, elementOpen, elementClose, text, route } from "wabi"
import { fix } from "./utils.js"
import { Maze } from "./maze.js"
import "../css/index.css";

const Layout = component({
    render() {
        const maze = new Maze(8)
        while(!maze.generateMaze());

        elementOpen("div", {class: "maze"})
        maze.render()
        elementClose("div")
    }
})

route("/", Layout)
