//This file contains code defining the truss class and methods needed to calculate the value of many truss properties

class Truss extends Skeleton { //Create a truss class which inherits general properties.
	constructor() { //Defines a constructor function for the truss object.
		super(); //Inherits attributes
		this.id = Trusses.length; //Sets the ID to be at the size of the array.
		this.nodes = []; //Initializes an empty array.
		this.members = []; //Initializes an empty array/
		this.unknowns = ""; //Initializes a unknowns variable.
		this.totalDef = 0; //Initializes the total deformation

		this.AddNode(this.padding, height - this.padding, this); //Adds a new default node.
		this.AddNode(width - this.padding, height - this.padding, this); // Adds a second default node.
		this.span = Math.abs(this.nodes[0].location.x - this.nodes[1].location.x); //Gets span in px distance

		this.nodes[0].SetExternalForce(0, 0); //Clears any external force
		this.nodes[1].SetExternalForce(0, 0); //Clears any external force
	}
	AddNode(x, y) { //Defines a method to add a new node.
		this.nodes[this.nodes.length] = new Node(this); //Adds a fixed node.
		this.nodes[this.nodes.length - 1].SetLocation(x, y); //Adds a second fixed node.
	}
	AddMember(parent1, parent2) { // Defines a method to add a new members.
		this.members[this.members.length] = new Member(this.nodes[parent1], this.nodes[parent2], this); //Adds a new member between two nodes.
		var id = this.members[this.members.length - 1].id; //Need to update the node objects with their members.
		this.nodes[parent1].members[this.nodes[parent1].members.length] = id;
		this.nodes[parent2].members[this.nodes[parent2].members.length] = id;
	}
	Draw(nodeLabels, externalForces, internalForces, nodeCoord) { //Draws the truss to the canvas
		background(51); // Clears the canvas
		for (var m in this.members) { //Draws in the members
			var currentMember = this.members[m];
			stroke(255, 255, 255);
			line(currentMember.parent1.location.x, currentMember.parent1.location.y,
				currentMember.parent2.location.x, currentMember.parent2.location.y); //Draws member line

			if (internalForces) { //If true, call InternalForceLabels() function
				InternalForceLabels(currentMember);
			}
		}
		for (var n in this.nodes) { //Draws in the nodes
			var currentNode = this.nodes[n];
			fill(113, 142, 164);
			stroke(0, 0, 0);
			ellipse(currentNode.location.x, currentNode.location.y, 8, 8);

			if (nodeLabels) { //If true call NodeIDLabels() function
				NodeIDLabels(currentNode);
			}
			if (externalForces) { //If true call ExternalForceVectors() function
				ExternalForceVectors(currentNode);
			}
			if (nodeCoord) { //If true call NodeCoords() function
				NodeCoords(currentNode);
			}
		}
	}
	InternalForces() { //Calculates the internal forces for the truss
		this.Reactions(); //Calls the reactions function
		do {
			var changeMade = false;
			for (var i = 0; i < this.nodes.length; i++) { //Goes through all the nodes
				var unknowns = this.Unknowns(i); //Stores a copy of unknowns
				if (unknowns.length == 2) {
					this.CalculateTwoUnknowns(i, unknowns); //Resolve two unknowns
					changeMade = true;
				} else if (unknowns.length == 1) {
					this.CalculateOneUnknown(i, unknowns); //Resolve a single unknown
					changeMade = true;
				}
			}
		} while (changeMade); //If a change has been made, not solved so iterate again
		this.Draw(true, true, true, false); //Draws the truss
	}
	Reactions() { //Calculates the necessary reaction forces acting on node 0 and node 1
		var totalForce = 0; //Initializes Total Variables
		var totalMoment = 0; //Initializes Total Variables
		var origin = this.nodes[0].location.x; //Defines pivot point

		for (var i = 0; i < this.nodes.length; i++) { //Adds to the total moment and force.
			totalForce += this.nodes[i].externalForce.y;
			totalMoment += (this.nodes[i].externalForce.y * Math.abs(this.nodes[i].location.x - origin));

			if (this.nodes[i].externalForce.x != 0) { //If the force has a horizontal component
				this.HorizontalReactions(this.nodes[i]); //Calls Horizontal Reactions
			}

		}
		var rB = (totalMoment / (this.span / this.scale)) * -1; //Calculates node 1's reaction
		var rA = 0 - totalForce - rB; //Calculates node 0's reaction
		this.nodes[0].externalForce.y += rA;
		this.nodes[1].externalForce.y += rB;
	}
	HorizontalReactions(n) { //Calculates horizontal reactions for a given node
		var fx = n.externalForce.x; //Gets force in x direction
		var y = n.location.y - this.nodes[0].location.y; //Finds moment height
		if (y == 0) {
			n.externalForce.x = 0; //Catches exception
		} else {
			var rB = (fx * y) / (this.span / this.scale); //Finds rB using formula, scales to px dist
			var rA = rB * -1; //Balances out rB
			this.nodes[0].externalForce.y += rA; //Adds forces on to fixed nodes
			this.nodes[1].externalForce.y += rB;

			var ratio = abs(this.nodes[0].location.x - n.location.x) * this.scale / this.span;
			//Defines a ratio to give x forces to.
			this.nodes[0].externalForce.x = -fx * ratio;
			this.nodes[1].externalForce.x = -fx * (1 - ratio);
		}

	}
	Unknowns(NodeID) { //Finds the unknown internal forces
		var currentNode = this.nodes[NodeID];
		var unknowns = [];
		for (var i = 0; i < currentNode.members.length; i++) {
			var currentMember = this.members[currentNode.members[i]];
			if (currentMember.internalForce == "#") { //Finds the other end of the member
				if (currentNode.id == currentMember.parent1.id) {
					unknowns[unknowns.length] = [currentMember.parent2.id, currentMember.id];
				} else {
					unknowns[unknowns.length] = [currentMember.parent1.id, currentMember.id];
				}
			}
		}
		return unknowns;
	}
	CalculateConstantForce(NodeID) { //Calculates the constant force acting on a node
		var currentNode = this.nodes[NodeID];
		var constForce = createVector(currentNode.externalForce.x, currentNode.externalForce.y * -1); //Adds external force to constant force

		for (var i = 0; i < currentNode.members.length; i++) {
			var currentMember = this.members[currentNode.members[i]];
			if (currentMember.internalForce != "#") { //If internal force is defined
				var temp = 0;
				if (currentMember.parent1.id == NodeID) { //Finds the other end of the member
					temp = currentMember.parent2.location;
				} else {
					temp = currentMember.parent1.location;
				}

				temp = p5.Vector.sub(temp, currentNode.location); //maps onto unit circle, so sin() and cos() are easy to find.
				temp.normalize(); //Makes magnitude 1.
				constForce.x += (currentMember.internalForce * temp.x);
				constForce.y -= (currentMember.internalForce * temp.y);
			}
		}
		return constForce;
	}
	CalculateTwoUnknowns(NodeID, unknowns) { //Resolves two unknown internal forces
		var start = this.nodes[NodeID].location;
		var end1 = this.nodes[unknowns[0][0]].location; //end of one member
		var end2 = this.nodes[unknowns[1][0]].location; //end of the other member
		var constForce = this.CalculateConstantForce(NodeID); //calls the constant force function

		end1 = (p5.Vector.sub(end1, start)).normalize(); //maps to unit circle
		end2 = (p5.Vector.sub(end2, start)).normalize(); //maps to unit circle
		var constMatrix = math.matrix([
			[constForce.x],
			[constForce.y]
		]); //creates a 1 x 2 matrix
		var angleMatrix = math.matrix([
			[end1.x, end2.x],
			[end1.y * -1, end2.y * -1]
		]); //creates a 2 x 2 matrix, multiply y by -1, because of opposite y direction

		var det = math.det(angleMatrix); //Calculates the determinant of the angleMatrix

		if (det != 0) { //This means equation has solutions
			angleMatrix = math.inv(angleMatrix); //inverses the matrix
			var resultMatrix = math.multiply(angleMatrix, constMatrix); //solves the equaiton
			this.members[unknowns[0][1]].internalForce = -resultMatrix.subset(math.index(0, 0));
			this.members[unknowns[1][1]].internalForce = -resultMatrix.subset(math.index(1, 0));
		} else { //Equation has no solutions, use large nunbers to make truss have high fitness value
			this.members[unknowns[0][1]].internalForce = Number.MAX_VALUE;
			this.members[unknowns[1][1]].internalForce = Number.MAX_VALUE;
		}
	}
	CalculateOneUnknown(NodeID, Unknowns) { //Resolves a single unknown force
		var start = this.nodes[NodeID].location; //Current node
		var end = this.nodes[Unknowns[0][0]].location; //Other end of the unknown member
		var constForce = this.CalculateConstantForce(NodeID);
		var temp1 = new p5.Vector(constForce.x, constForce.y * -1).normalize(); //Direction of known force
		var temp2 = p5.Vector.sub(end, start).normalize(); //Direction of member
		var force = new p5.Vector(constForce.x * temp1.x, constForce.y * temp1.y);

		if (temp1.sub(temp2).mag() < 0.00001) { //If temp1 and temp2 have approximate same value, need this to overcome rounding errors
			force = -force.mag(); //Change sign
		} else {
			force = force.mag(); //Keep sign the same
		}
		this.members[Unknowns[0][1]].internalForce = force;
	}
	CalculateDeformation() { //Calaulates deformation of the truss
		var deformTruss = new DeformedTruss(this.id); //Creates a deformed truss object
		deformTruss.DeformedPositions(this.id); //Calculates deformation
		this.Draw(); //Draw current truss
		this.totalDef = deformTruss.totalDef; //Gets total deformation
		deformTruss.Draw(); //Draw deformed model
	}
	UpdateParents() { //Updates the parent references
		for (var n in this.nodes) { //Sets the correct parent
			this.nodes[n].parent = this;
		}
		for (var m in this.members) { //Sets the correct parents
			this.members[m].parent1 = this.nodes[this.members[m].parent1.id];
			this.members[m].parent2 = this.nodes[this.members[m].parent2.id];
			this.members[m].parent = this;
		}
	}
}
