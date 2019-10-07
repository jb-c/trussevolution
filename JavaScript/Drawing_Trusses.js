//This file contains methods concerned with drawing a truss and outputting its data

function NodeIDLabels(n) { //Input a node object - Draws node ID labels
	fill(255, 255, 255);
	text(n.id, n.location.x, n.location.y, 12, 12); //Displays node ID as text
}

function ExternalForceVectors(n) { //Input a node object - Draws red external force lines
	var currentNode = n.location;
	var currentForce = n.externalForce;
	var endNode = p5.Vector.add(currentNode, currentForce); //Finds where the 'end' of the force is
	fill(255, 255, 255);
	stroke(255, 14, 13);
	line(currentNode.x, currentNode.y, endNode.x, endNode.y); //Draws a line representing the external force.
}

function InternalForceLabels(m) { //Input a member object - Draws internal force labels
	fill(255, 255, 255);
	stroke(12, 232, 72);
	var parent1 = m.parent1.location;
	var parent2 = m.parent2.location;
	var force = Math.round((m.internalForce) * 100) / 100; //Rounds to 2dp
	if (isNaN(force)) { //If internal force is undefined use the '#' symbol
		force = '#';
	}
	var midpoint = new p5.Vector((parent1.x + parent2.x) / 2, (parent1.y + parent2.y) / 2);
	text(force, midpoint.x, midpoint.y); //Draws text to midpoint of member
}

function NodeCoords(n) { //Input a node object - Displays (x, y) coords for each node
	fill(255, 255, 255);
	stroke(0, 0, 0);
	var x = Math.round((n.location.x) * 10) / 10; //Rounds to 1 dp.
	var y = Math.round((n.location.y) * 10) / 10;
	text((x + " , " + y), n.location.x, n.location.y, 120, 12); //Outputs to canvas
}

function CreateGraph(array, axis) { //Saves a jpg of a graph
	var graph = createGraphics(500, 500); //Creates virtual canvas
	var padding = 20; //Width around bottom edge
	graph.background(255); //White background

	var minV = min(array); //Finds smallest value in the array
	var maxV = max(array); //Finds largest value in the array

	push(); //Saves current drawing settings
	stroke(255); //Black lines
	graph.line(padding, graph.height - padding, padding, 0); //Y axis
	graph.line(padding, graph.height - padding, width, graph.height - padding); //X axis
	graph.text(axis.title, graph.width / 2 - padding, padding); //Title at the top of the graph
	graph.text(axis.x, graph.width - 2.5 * padding, graph.height); //X axis label
	graph.rotate(PI / 2); //Rotates 90 anticlockwise
	graph.text(axis.y, 0, 0); //Y axis label
	graph.rotate(-PI / 2); //Rotates back to normal

	graph.noStroke(); //no outline
	graph.fill(0, 128, 255); //Blue fill for data points

	for (var d in array) { //For each element in the array
		var y = map(array[d], minV, maxV, graph.height - padding, padding, true); //Map y to image dimensions
		var x = d * (graph.width - padding) / array.length; //x is evenly split between iterations
		graph.ellipse(x + padding, y - padding, 4, 4); //Draws a circle radius 2 px to graph
	}
	pop(); //Restores original drawing settings
	saveCanvas(graph, "graph", "jpg"); //Saves graph as an image.
}

function LogProperties(id) { //Saves a txt file containing details of seed and resulting truss
	var start = Trusses[0]; //Copies reference to seed truss
	var end = Trusses[id]; //Copies reference to best truss

	start = [start.totalDef, start.weight, start.cost, start.height, start.bitstring];
	end = [end.totalDef, end.weight, end.cost, end.height, end.bitstring]

	end = end.slice(); //Copies properties in array by val
	start = start.slice(); //Copies properties in array by val

	for (var p = 1; p < end.length - 2; p++) { //Miss out bitstring, height and total deformation
		end[p] = ((end[p] * start[p]) + start[p]); //Converts from % difference to actual value
		start[p] = round(start[p] * 100) / 100; //Rounds to 2 dp
		end[p] = round(end[p] * 100) / 100; //Rounds to 2 dp
	}
	start[0] = round(start[0] * 100) / 100; //Rounds to 2 dp
	end[0] = round(end[0] * 100) / 100; //Rounds to 2 dp
	start[3] = round(start[3] * 100) / 100; //Rounds to 2 dp
	end[3] = round(end[3] * 100) / 100; //Rounds to 2 dp

	var txt = []; //Array to store strings

	txt.push("\t\t\t A Log of Truss Evolution \n\r\n\r")
	txt.push("Deformation- \t Seed Truss: " + start[0] + "\t Resulting Truss:" + end[0] + "\n\r");
	txt.push("Weight- \t Seed Truss: " + start[1] + "\t Resulting Truss:" + end[1] + "\n\r");
	txt.push("Cost- \t\t Seed Truss: " + start[2] + "\t Resulting Truss:" + end[2] + "\n\r");
	txt.push("Height- \t Seed Truss: " + start[3] + "\t\t Resulting Truss:" + end[3] + "\n\r\n\r");
	txt.push("Original Bitstring- \t" + start[4] + "\n\r");
	txt.push("New Bitstring- \t\t" + end[4] + "\n\r");

	saveStrings(txt, "log"); //Saves string array as a file
}
