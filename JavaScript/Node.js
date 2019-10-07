//This file contains the code defining the node class and methods

class Node extends Skeleton { //Creates a node class which inherits general properties.
	constructor(ParentTruss) { // Defines a constructor function for the node object, taking a parent truss as a parameter.
		super(); //Inherits attributes.
		this.parent = ParentTruss; //This passes the truss object by reference.
		this.id = this.parent.nodes.length;
		this.location = new p5.Vector(0, 0);
		this.externalForce = new p5.Vector(0, 0);
		this.members = [];
	}
	SetLocation(x, y) {//Allows location to be specified easily
		this.location.x = parseFloat(x);
		this.location.y = parseFloat(y);
	}
	SetExternalForce(fx, fy) {//Allows external force to be specified easily
		this.externalForce.x = parseFloat(fx);
		this.externalForce.y = parseFloat(fy);
	}
}
