//This file contains the necessary methods to calculate deformation and produce a deformed model

class DeformedTruss extends Truss { //A deformed truss class, inherits from truss
	constructor(cloneID) { //Creates key attributes, and clears forces
		super(); //Inherits methods & attributes
		this.id = cloneID; //Updates ID
		this.nodes = cloneArray(Trusses[cloneID].nodes); //Deep clones array
		this.members = cloneArray(Trusses[cloneID].members); //Deep clones array
		this.unknowns = ""; //Initializes an unknowns variable.
		this.scale = Trusses[cloneID].scale; //Gets scale from Parent Truss
		this.span = Trusses[cloneID].span; //Gets span from Parent Truss
		this.totalDef = 0;
		this.material = Trusses[cloneID].material; //Gets material from Parent Truss

		for (var n in this.nodes) { //Sets the correct parent and clears external forces
			this.nodes[n].parent = this;
			this.nodes[n].SetExternalForce(0, 0);
		}
		for (var c in this.members) { //Sets the correct parent and clears internal forces
			this.members[c].parent = this;
			this.members[c].internalForce = '#';
		}
	}
	DeformedPositions() { //Updates nodes with new locations
		var deformation = []; //Creates an empty array
		for (var n = 2; n < this.nodes.length; n++) { //Once per node, missing fixed ones
			deformation[n] = createVector(0, 0); //Creates a zero vector

			this.nodes[n].SetExternalForce(0, 1); //Unit load vertically
			this.InternalForces(); //Calls internal force function
			deformation[n].y = this.ReturnDeformation(); //Calculate & store result

			this.nodes[n].SetExternalForce(1, 0); //Unit load horizontally
			this.InternalForces(); //Calls internal force function
			deformation[n].x = this.ReturnDeformation(); //Calculate & store result

			this.nodes[n].SetExternalForce(0, 0); //Reset external force for next iteration
		}
		for (var n = 2; n < this.nodes.length; n++) {
			this.nodes[n].location.add(deformation[n].mult(1 / this.scale)); //Adds deformation to node locations, in pixels
		}
	}
	ReturnDeformation() { //Calculates the deformation for a node in a direction
		//Deformation is sum of virtual loading * internal force * length of member / (ym * area)
		var def = 0;
		for (var m in this.members) { //Iterates once per member
			def += (this.members[m].internalForce * //Finds deformation using formula, in metres
				Trusses[this.id].members[m].internalForce * (this.members[m].length * this.scale));
			this.members[m].internalForce = '#'; //Clears internal force for next iteration
		}
		def = def / ((pow(this.beamRadius, 2) * PI) * (this.material.yModulus * Math.pow(10, 9))); //Divides by YM and area of beam
		this.totalDef += Math.abs(def);
		return def;
	}
	Draw() { //Draws a deformed model to the canvas
		push(); //Saves current drawing settings
		strokeWeight(2);
		stroke(255, 85, 10, 100);
		fill(255, 127, 11);

		for (var n in this.nodes) { //Draws a circle on node location
			var node = this.nodes[n].location;
			ellipse(node.x, node.y, 5, 5);
		}
		for (var m in this.members) { //Draws a line between parents
			var p1 = this.nodes[this.members[m].parent1.id].location;
			var p2 = this.nodes[this.members[m].parent2.id].location;
			line(p1.x, p1.y, p2.x, p2.y);
		}
		pop(); //Restores previous drawing settings
	}
}
