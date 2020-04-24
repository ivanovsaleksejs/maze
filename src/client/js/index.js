import { component, elementOpen, elementClose, text, route } from "wabi"
import { fix } from "./utils.js"
import { Maze } from "./maze.js"
import "../css/index.css";

const Layout = component({
	render() {	
		console.log(fix(f => x => x == 0 ? 1 : x * f(f)(x - 1))(5))
		const maze = new Maze(8)
		while(!maze.generateMaze());

		elementOpen("div", {class: "maze"})
		maze.render()
		elementClose("div")
	}
})

route("/", Layout)
