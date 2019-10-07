//This file contains the methods needed to load a pre defined truss

function LoadDefaultTruss(selection){ //Loads a default truss into the Trusses array
	Trusses.length = 0; //Clears the array
	Trusses[0] = new DefaultTruss(selection); //Adds default truss to array
	Trusses[0].Draw(true,true); //Draws to the canvas
}

class DefaultTruss extends Truss { //Default truss class to override normal constructor function
	constructor(selection) {
		super(); //Inherits from the truss class
		if (selection == 1) { //If user selects the first default truss
			var origin = new p5.Vector(this.padding, height - this.padding); //node 0
			var span = this.nodes[1].location.x - this.nodes[0].location.x; //Horizontal distance
			var subscale = span / 30; //Not to be confused with main scale.

			this.scale = 30 / span;  //M to px scale
			this.span = 30;  //The 30 is the span of the truss I designed

			this.material = materials[7]; //Sets material to concrete

			//Adds the nodes in terms of the padding and the origin.
			this.AddNode(origin.x + (subscale * 10), origin.y, this);
			this.AddNode(origin.x + (subscale * 10), origin.y - (subscale * 10), this);
			this.AddNode(origin.x + (subscale * 20), origin.y, this);
			this.AddNode(origin.x + (subscale * 20), origin.y - (subscale * 10), this);

			//Adds members linking pairs of nodes
			this.AddMember(0, 2);
			this.AddMember(2, 4);
			this.AddMember(1, 4);
			this.AddMember(1, 5);
			this.AddMember(3, 5);
			this.AddMember(0, 3);
			this.AddMember(2, 3);
			this.AddMember(4, 5);
			this.AddMember(3, 4);

			//Sets some external forces acting on the truss.
			this.nodes[2].SetExternalForce(0, 100000);
			this.nodes[4].SetExternalForce(0, 100000);

		}else if (selection == 2) { //If user selects the second default truss
			var origin = new p5.Vector(this.padding, height - this.padding); //node 0
			var span = this.nodes[1].location.x - this.nodes[0].location.x; //Horizontal distance
			var subscale = span / 30; //Not to be confused with main scale.

			this.scale = 30 / span; //M to px scale
			this.span = 30; //The 30 is the span of the truss I designed

			this.material = materials[29]; //Sets material to medium strength steel

			//Adds the nodes in terms of the padding and the origin.
			this.AddNode(origin.x + (subscale * 10), origin.y, this);
			this.AddNode(origin.x + (subscale * 20),origin.y,this);
			this.AddNode(origin.x + (subscale * 5),origin.y - (sin(PI/3) * 10 * subscale),this);
			this.AddNode(origin.x + (subscale * 15),origin.y - (sin(PI/3) * 10 * subscale),this);
			this.AddNode(origin.x + (subscale * 25),origin.y - (sin(PI/3) * 10 * subscale),this);

			//Adds members linking pairs of nodes
			this.AddMember(0,2);
			this.AddMember(2,3);
			this.AddMember(3,1);
			this.AddMember(1,6);
			this.AddMember(6,5);
			this.AddMember(5,4);
			this.AddMember(0,4);
			this.AddMember(4,2);
			this.AddMember(2,5);
			this.AddMember(5,3);
			this.AddMember(3,6);

			//Sets some external forces acting on the truss.
			this.nodes[2].SetExternalForce(0,500000);
			this.nodes[3].SetExternalForce(0,500000);
		}else if (selection == 3) { //If user selects the thrird default truss
			var origin = new p5.Vector(this.padding, height - this.padding); //node 0
			var span = this.nodes[1].location.x - this.nodes[0].location.x; //Horizontal distance
			var subscale = span / 45; //Not to be confused with main scale.

			this.scale = 45 / span;  //M to px scale
			this.span = 45;  //The 30 is the span of the truss I designed

			this.material = materials[31]; //Sets material to titanium alloy

			//Adds the nodes in terms of the padding and the origin.
			this.AddNode(origin.x + (subscale * 7),origin.y,this);
			this.AddNode(origin.x + (subscale * 14.5),origin.y,this);
			this.AddNode(origin.x + (subscale * 22.5),origin.y,this);
			this.AddNode(origin.x + (subscale * 30.5),origin.y,this);
			this.AddNode(origin.x + (subscale * 38),origin.y,this);
			this.AddNode(origin.x + (subscale * 7),origin.y - (subscale * 8),this);
			this.AddNode(origin.x + (subscale * 14.5),origin.y - (subscale * 12),this);
			this.AddNode(origin.x + (subscale * 22.5),origin.y - (subscale * 14),this);
			this.AddNode(origin.x + (subscale * 30.5),origin.y - (subscale * 12),this);
			this.AddNode(origin.x + (subscale * 38),origin.y - (subscale * 8),this);

			//Adds members linking pairs of nodes
			this.AddMember(0,2);
			this.AddMember(2,3);
			this.AddMember(3,4);
			this.AddMember(4,5);
			this.AddMember(5,6);
			this.AddMember(6,1);
			this.AddMember(1,11);
			this.AddMember(11,10);
			this.AddMember(10,9);
			this.AddMember(9,8);
			this.AddMember(8,7);
			this.AddMember(7,0);
			this.AddMember(2,7);
			this.AddMember(7,3);
			this.AddMember(3,8);
			this.AddMember(8,4);
			this.AddMember(4,10);
			this.AddMember(10,5);
			this.AddMember(5,11);
			this.AddMember(11,6);
			this.AddMember(4,9);

			//Sets some external forces acting on the truss.
			this.nodes[2].SetExternalForce(0,200000);
			this.nodes[3].SetExternalForce(0,200000);
			this.nodes[4].SetExternalForce(0,200000);
			this.nodes[5].SetExternalForce(0,200000);
			this.nodes[6].SetExternalForce(0,200000);
		}else if (selection == 4) { //If user selects the fourth default truss
			var origin = new p5.Vector(this.padding, height - this.padding); //node 0
			var span = this.nodes[1].location.x - this.nodes[0].location.x; //Horizontal distance
			var subscale = span / 15; //Not to be confused with main scale.

			this.scale = 15 / span;  //M to px scale
			this.span = 15;  //The 30 is the span of the truss I designed

			this.material = materials[27]; //Sets material to spruce wood

			//Adds the nodes in terms of the padding and the origin.
			this.AddNode(origin.x + (subscale * 6),origin.y,this);
			this.AddNode(origin.x + (subscale * 10),origin.y,this);
			this.AddNode(origin.x + (subscale * 12),origin.y,this);
			this.AddNode(origin.x + (subscale * 4.8),origin.y - (subscale * 2.4),this);
			this.AddNode(origin.x + (subscale * 10),origin.y - (subscale * 5),this);
			this.AddNode(origin.x + (subscale * 13.5),origin.y - (subscale * 1.5),this);

			//Adds members linking pairs of nodes
			this.AddMember(0,2);
			this.AddMember(2,3);
			this.AddMember(3,4);
			this.AddMember(4,1);
			this.AddMember(1,7);
			this.AddMember(7,6);
			this.AddMember(6,5);
			this.AddMember(5,0);
			this.AddMember(5,2);
			this.AddMember(2,6);
			this.AddMember(6,4);
			this.AddMember(4,7);
			this.AddMember(6,3);

			//Sets some external forces acting on the truss.
			this.nodes[2].SetExternalForce(0,20000);
			this.nodes[3].SetExternalForce(0,20000);
			this.nodes[4].SetExternalForce(0,20000);
		}
	}
}
