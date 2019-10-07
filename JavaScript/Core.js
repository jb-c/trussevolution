//This file contains the skeleton object and general truss methods, a clone function and an export function

class Skeleton { //Defines key attributes and methods for the general truss
	constructor() { //Declares key attributes for drawing and evolution
		this.scale = 1; //Default scale
		this.padding = 40 / this.scale; //Default padding
		this.beamRadius = beamRad; //Gets value from global variable
		this.material = materials[0]; //Default material

		this.bitstring = ''; //Creates an empty bitstring
		this.nodesMask = ''; //Defines an empty attribute
		this.externalForces = ''; //Defines an empty attribute
		this.membersParent = ''; //Defines an empty attribute
		this.weights = null; //Sets to null
	}
	Mutate() { //Mutates a truss
		this.bitstring = Mutate(this.bitstring); //Mutates string
		var newT = Decode(this.bitstring, this.nodesMask, this.externalForces,
				this.membersParent, this.span, this.weights,this.material.id); //Returns a truss object
		this.nodes = _.cloneDeep(newT.nodes); //Copies by value
		this.members = _.cloneDeep(newT.members); //Copies by value
		this.UpdateParents(); //Updates internal references
		this.CalculateFitness(); //Updates fitness
	}
	UpdateBitstring() { //Updates the bitstring and associates arrays
		var temp = ToBitstring(this); //Converts truss to bitsring
		this.bitstring = temp.bString; //Gets new bitstring
		this.externalForces = temp.eForces; //Gets new external forces array
		this.nodesMask = temp.nMasks; //Gets new nodes mask array
		this.membersParent = temp.mParent; //Gets new members parent array
	}
	CalculateFitness() { //Calculates the fitness value of a truss
		this.InternalForces(); //Calls InternalForces()
		this.CalculateDeformation(); //Calls deformation functions
		var totalLen = 0; //Creates a total variable
		var highest = height; //Stores y coord of highest node
		var index = 0; //Stores index of highest node]

		for (var m in this.members) {
			totalLen += this.members[m].length; //Finds total member length, in PX
		}
		this.weight = totalLen * this.scale * (pow(this.beamRadius, 2) * PI) * this.material.density;
		this.cost = this.weight * this.material.cost; //Calculates weight and cost, based on volume of material used

		for (var n in this.nodes) {
			if (this.nodes[n].location.y < highest) { //Finds highest node, smallest y-coord
				highest = this.nodes[n].location.y; //Stores height
				index = n; //Stores index
			}
		}
		this.height = abs(this.nodes[0].location.y - highest) * this.scale; //Calculates max height, in m
		this.deltaH = abs(Trusses[0].height - this.height); //Calculates difference in height between seed truss

		if (this.id != 0) { //Finds the percentage difference between seed truss and current truss' values
			this.totalDef = (this.totalDef - Trusses[0].totalDef) / Trusses[0].totalDef;
			this.weight = (this.weight - Trusses[0].weight) / Trusses[0].weight;
			this.cost = (this.cost - Trusses[0].cost) / Trusses[0].cost;
			this.deltaH = this.deltaH / Trusses[0].height;
		}

		this.fitness = (this.weights[0] * this.totalDef) + (this.weights[1] * this.weight) +
			(this.weights[2] * this.cost) + (this.weights[3] * this.deltaH); //Calculates fitness based on different properties);
	}
}

function cloneArray(arry) { //Deep clones an array/object
	var clone = arry.slice(); //Copies array by value
	for (var i = 0; i < arry.length; i++) {
		if (clone[i] === Object(clone[i])) {
			//Using the lodash library deep clone function
			clone[i] = _.cloneDeep(clone[i]);
		}
	}
	return clone;
}

function Export(id) { //Exports a specified truss to a txt file
	var t = Trusses[id]; //Gets the truss to export
	t.UpdateBitstring(); //Updates the bitstring
	var txt = []; //Defines an empty array

	txt.push(t.bitstring + "*");
	txt.push(JSON.stringify(t.nodesMask) + "*");
	txt.push(JSON.stringify(t.externalForces) + "*");
	txt.push(JSON.stringify(t.membersParent) + "*");
	txt.push(t.span + "*");
	txt.push(JSON.stringify(t.weights) + "*");
	txt.push(t.material.id);

	saveStrings(txt, "Truss"); //Saves string array as a file
}
