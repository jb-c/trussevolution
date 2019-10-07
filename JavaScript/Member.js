//This file contains the code for a member object

class Member extends Skeleton { //Defines the member class
	constructor(parent1, parent2, ParentTruss) { //Creates a new member
		super(); //Inherits from parent
		this.parent = ParentTruss; //This passes the truss object by reference.
		this.id = this.parent.members.length; //Next free space in members array
		this.parent1 = parent1; //Stores a reference to the two parent nodes
		this.parent2 = parent2;
		this.internalForce = "#"; //I use the '#' as a null identifier
		this.length = this.parent1.location.dist(this.parent2.location);//Calculates the length of the member, in px /not to scale
	}
}
