//This file contains the code needed to mutate, decode and breed trusses

function ToBitstring(t) { //Converts a truss to a bitstring and property arrays
	var nodesMask = []; //x, y, fx, fy - defines empty array
	var membersParent = []; // [parent1, parent2] - defines empty array
	var externalForces = []; //[fx, fy] - defines empty array
	var bitstring = ''; //Defines empty string
	var extraZeros = ''.padStart(extraBits, '0'); //Creates a zero string, with extra bits characters

	for (var n = 2; n < t.nodes.length; n++) { //Fills members mask and adds to bitstring
		nodesMask[n] = []; //Creates an empty array
		nodesMask[n][0] = ConvertToMask(t.nodes[n].location.x, bitstring.length, extraBits); //X coord
		bitstring += extraZeros + Math.round(t.nodes[n].location.x).toString(2); //Adds to bitstring
		nodesMask[n][1] = ConvertToMask(t.nodes[n].location.y, bitstring.length, extraBits); //Y coord
		bitstring += extraZeros + Math.round(t.nodes[n].location.y).toString(2); //Adds to bitstring

		externalForces[n] = [t.nodes[n].externalForce.x, t.nodes[n].externalForce.y]; //Adds current node's external force to array
	}
	for (var m in t.members) {
		membersParent[m] = [t.members[m].parent1.id, t.members[m].parent2.id]; //Adds current member's parents to array
	}
	return { //Returns an object containing all relevant properties.
		bString: bitstring,
		nMasks: nodesMask,
		eForces: externalForces,
		mParent: membersParent,
		span: t.span
	};
}

function ConvertToMask(val, offset, extraBits) { //Converts a value and offsets to a binary mask
	var str = ""; //Creates an empty string

	Math.round(val); // Rounds to the nearest integer
	val = val >>> 0; //Bitshift zero places to catch negatives
	val = val.toString(2).length; //Converts to binary and finds length

	str = str.padEnd(val + extraBits, '1'); //Adds max number of bits to end
	str = str.padStart(offset + str.length, '0'); //Pads start with zeros

	return str; //outputs a binary string with offset's value 0's and value + extraBits 1's
}

function Decode(bitstring, nodesMask, externalForces, membersParent, span, weights, materialID) { //Creates a truss from bitstring and property arrays
	var truss = new Truss(); //Creates a new truss object
	for (var n in nodesMask) {
		var xOff = nodesMask[n][0].split('1', 1)[0].length; //Gets the number of 0's at the start
		var yOff = nodesMask[n][1].split('1', 1)[0].length; //Gets the number of 0's at the start

		var xMask = parseInt(nodesMask[n][0], 2); //Converts x mask to number
		var yMask = parseInt(nodesMask[n][1], 2); //Converts y mask to number

		var xVal = bitstring.substr(xOff, nodesMask[n][0].length - xOff); //Gets relevant part of bitstring
		var yVal = bitstring.substr(yOff, nodesMask[n][1].length - yOff); //Gets relevant part of bitstring

		xVal = parseInt(xVal, 2); //Converts to number
		yVal = parseInt(yVal, 2); //Converts to number

		xVal = min((xMask & xVal), width - 2); //If xVal is off the canvas, return width (with a 2px buffer)
		yVal = min((yMask & yVal), height - 2); //If yVal is off the canvas, return height (with a 2px buffer)

		truss.AddNode(xVal, yVal); //Adds node at decoded location
		truss.nodes[truss.nodes.length - 1].SetExternalForce(externalForces[n][0], externalForces[n][1]); //Adds external forces
	}
	for (var m in membersParent) {
		truss.AddMember(membersParent[m][0], membersParent[m][1]); //Adds member between the parent nodes
	}
	truss.scale = span / truss.span; //Updates the scale
	truss.span = span; //Stores the span
	truss.weights = weights; //Stores the weights
	truss.material = materials[materialID]; //Sets the correct material

	return truss; //Returns a truss object
}

function Mutate(str) { //Mutates a bitstring
	var numMutate = floor(str.length * BitMutProb); //Selects an amount of bits to be flipped

	str = str.split(''); //Converts to char array

	for (var i = 0; i < numMutate; i++) { //Runs numMutate times
		var index = floor(random(0, str.length)); //Random char from bitstring
		if (str[index] == '1') { //Flips the selected bit
			str[index] = '0'
		} else {
			str[index] = '1'
		}
	}
	return str.join(''); //Joins array to string
}

function FixedCrossover(str1, str2) { //Breeds two bitstrings, alternating from each parent by a set interval
	var extra = str1.length % CrossoverInterval; //Gets remainder of division
	var cycles = str1.length - extra; //Highest multiple of interval in range
	var newStr = ''; //Creates an empty string
	var toggle = true; //Defines a toggle variable

	for (var i = 0; i < cycles; i += CrossoverInterval) {
		if (toggle) { //Alternates every iteration
			newStr += str1.substr(i, CrossoverInterval); //Gets next interval lot of characters
			toggle = false; //Toggles between str1 and str2
		} else {
			newStr += str2.substr(i, CrossoverInterval); //Gets next interval lot of characters
			toggle = true; //Toggles between str1 and str2
		}
	}

	if (toggle) { //Gets bits from next parent string in toggle rotation
		newStr += str1.substr(str1.length - extra, extra); //Gets the last extra amount of characters
	} else {
		newStr += str2.substr(str2.length - extra, extra); //Gets the last extra amount of characters
	}
	return newStr;
}

function UniformCrossover(str1, str2) { //Breeds two bitstrings, randomly selecting a bit from each parent
	str1 = str1.split(''); //Converts to char array
	str2 = str2.split(''); //Converts to char array
	var newStr = []; //Empty array
	var p1Prob = 0.5; //Probability str1 is used, can bias if needed

	for (var i = 0; i < str1.length; i++) {
		var rdn = random(0, 1); //Random between 0 and 1.
		if (rdn < p1Prob) {
			newStr[i] = str1[i]; //From parent1
		} else {
			newStr[i] = str2[i]; //From parent2
		}
	}
	return newStr.join(''); //Joins the array back together
}
