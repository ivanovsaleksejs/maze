export class Room {
	constructor() {
		return  {
			x: 0,
			y: 0,
			edgesFrom: [],
			edgesTo:   [],
			limit:      4,
			roomNode:  null
		}
	}
}
