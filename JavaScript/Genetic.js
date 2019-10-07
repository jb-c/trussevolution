//This file contains the methods associated with the genetic algorithm

function GeneticIteration() { //Performs one iteration of the entire genetic algorithm
	//Population has already been initialized at this point - on page load
	MutateTrusses(); //Perform some mutations
	Sort(); //Sort the trusses in order of fitness
	//Choose which removal method to use by commenting one out
	RemoveElements_Analytical(); //Remove outliers based on top trusses' fitness
	//RemoveElements_Strict(); //Removes set % of bottom trusses
	Repopulate(populationSize); //Breeds to fill the array again

	Trusses[1].Draw(); //Draws the best truss
	Trusses[1].CalculateDeformation(); //Draws deformed model for the best truss

	FitnessData.push(Trusses[1].fitness); //Saves best fitness value to an array
	DefData.push(Trusses[1].totalDef); //Saves best deformation value to an array
	WeiData.push(Trusses[1].weight); //Saves best weight value to an array
	CostData.push(Trusses[1].cost); //Saves best cost value to an array
	HeightData.push(Trusses[1].height); //Saves best height value to an array

	UpdateReportLabels(); //Updates HTML current improvement tags
	OptimiseMaterial(); //Outputs recommended material to user

	push(); //Saves current drawing settings
	fill(255); //White text
	text('Fitness = ' + Trusses[1].fitness, 0, 10); //Draws fitness value
	text('Iteration = ' + iterationCount, 0, 20) //Draws iteration counter
	pop(); //Restores current drawing settings
	iterationCount++; //Increments iteration counter
}

function DrawTrussesArray(i) { //Draws a truss in the trusses array
	if (iterationinterval != null) { //If interval is defined
		clearInterval(iterationinterval); //Stops GeneticIteration() from being called.
	}
	if (i >= Trusses.length) { //Stops out of range error
		i = 0;
		clearInterval(drawInterval); //Stops drawing the trusses
	} else {
		Trusses[i].Draw(); //Draws current truss
		Trusses[i].CalculateDeformation(); //Draws current deformed model
		push(); //Saves current drawing settings
		fill(255); //White text
		text('Fitness = ' + Trusses[i].fitness, 0, 10);
		text('ID = ' + i, 0, 20);
		pop(); //Restores previous drawing settings
	}
}

function InitializePopulation(popSize) { //Initially fills the Trusses array
	Trusses[0].UpdateBitstring(); //Calculates initial states
	Trusses[0].CalculateFitness();
	Trusses[0].fitness = 0; //Initializes fitness value

	for (var i = 1; i < popSize; i++) {
		Trusses[i] = _.cloneDeep(Trusses[0]); //Deep clones seed truss
		Trusses[i].id = i; //Updates ID
		Trusses[i].nodesMask.splice(0, 2); //Removes first two elements from array
		Trusses[i].externalForces.splice(0, 2); //Removes first two elements from array
		Trusses[i].UpdateParents(); //Updates internal references
	}
}

function MutateTrusses() { //Mutates a random amount of trusses in the array
	for (var t in Trusses) {
		var rdn = random(0, 1); //Random between 0 and 1.
		if ((rdn < TrussMutationProb) && (t > (DontMutate * Trusses.length))) {
			Trusses[t].Mutate(); //Mutates selected truss
		}
	}
}

function Sort() { //Sorts the trusses array by fitness value
	var temp = 0; //Creates a data hold
	for (var i = 1; i < Trusses.length; i++) {
		temp = _.cloneDeep(Trusses[i]);
		j = i - 1;
		while ((j >= 1) && (Trusses[j].fitness > temp.fitness)) { //Finds the position to insert
			DeepClone(j + 1, Trusses[j]);
			j = j - 1;
		}
		DeepClone(j + 1, temp);
	}
}

function DeepClone(target, source) { //Target is a truss ID and source is a truss object - Deep copies a truss
	var string = source.bitstring; //Copies bitstring
	Trusses[target] = _.cloneDeep(source); //Using lodash deep clone
	Trusses[target].nodesMask; //Copes nodesMask
	Trusses[target].externalForces; //Copes external forces
	Trusses[target].bitstring = string; //Copies bitstring
	Trusses[target].UpdateParents(); //Updates internal references
	Trusses[target].id = target; //Updates the relevant id
}

function RemoveElements_Strict() { //Removes % amount of trusses from array
	var numPop = floor(StrictThreshold * Trusses.length); //Calculates the number of elements to remove
	Trusses.splice(Trusses.length - numPop, numPop); //Pops elements from trusses array.
}

function RemoveElements_Analytical() { //Removes trusses from away based on outlier test
	var sx = 0; //Sum of fitness
	var sx2 = 0; //Sum of fitness squared
	for (var i = 1; i < AnalyticalCalculationVal * Trusses.length; i++) { //Skips the seed truss
		sx += Trusses[i].fitness; //Adds fitness to total
		sx2 += pow(Trusses[i].fitness, 2); //Adds fitness squared to total
	}

	var xbar = sx / (Trusses.length - 1); //The mean, not including seed
	var sd = sqrt((sx2 - ((Trusses.length - 1) * pow(xbar, 2))) / (Trusses.length - 2)); //Calculates standard deviation
	var threshold = xbar + (Analyticalmultiplier * sd); //Calculates upper bound for outliers

	var i = Trusses.length - 1; //Index of last element
	while ((Trusses[i].fitness > threshold) && (i > 0)) { //Whilst above threshold - Iterates backwards
		i--; //Decrease i, move 1 index down the array
		Trusses.pop(); //Remove last element from trusses array
	}
}

function Breed(str1, str2) { //Returns a child bitstring from two parents, randomly choosing a breeding method
	var rdn = floor(random(0, 2)); //Random integer 0,1
	if (rdn == 0) {
		return FixedCrossover(str1, str2);
	} else if (rdn == 1) {
		return UniformCrossover(str1, str2);
	}
}

function Repopulate(popSize) { //Refills the trusses array with offspring trusses
	for (var i = Trusses.length - 1; i < popSize; i++) { //Difference from popSize and current array size
		var rdn = random(0, 1); //Random number between 0 and 1.
		var p1, p2, str;

		if (rdn < RepopulateMixed) { //One from top one from bottom 50%
			p1 = floor(random(0, 0.5 * (Trusses.length - 1))); //Random index from top 50%
			p2 = floor(random(0.5 * (Trusses.length - 1), (Trusses.length - 1))); //Random index from bottom 50%
		} else { //Both from top 50%
			p1 = floor(random(0, 0.5 * (Trusses.length - 1))); //Random index from top 50%
			p2 = floor(random(0, 0.5 * (Trusses.length - 1))); //Random index from top 50%
		}
		var materialID = Trusses[p1].material.id; //Gets current material ID
		p1 = Trusses[p1].bitstring; //Gets relevant bitstring
		p2 = Trusses[p2].bitstring; //Gets relevant bitstring
		str = Breed(p1, p2); //Creates a new bitstring

		var b = Trusses[0]; //Base truss, to get attributes form
		Trusses[i] = Decode(str, b.nodesMask, b.externalForces, b.membersParent, b.span, b.weights, materialID);
		Trusses[i].UpdateBitstring(); //Needs masks and arrays to mutate properly
		Trusses[i].bitstring = str; //Replace bitstring with padding as well
		Trusses[i].nodesMask = Trusses[0].nodesMask.slice(); //Copes by value
		Trusses[i].nodesMask.splice(0,2); //Removes undefined values
		Trusses[i].externalForces = Trusses[0].externalForces.slice(); //Copes by value
		Trusses[i].externalForces.splice(0,2); //Removes undefined values
		Trusses[i].id = i; //Updates truss ID
		Trusses[i].UpdateParents(); //Need to make sure references are consistent
		Trusses[i].CalculateFitness(); //So it can be ranked
	}
}

function OptimiseMaterial(){ //Outputs a recommended material to the user
	var t = Trusses[1]; //Gets best truss
	var oldDef = t.totalDef; //Gets current deformation
	var oldCost = t.cost; //Gets current cost
	var oldWeight = t.weight; //Gets current weight
	var w = t.weights; //Gets preference weights

	var fitness = []; //Creates an empty array
	for (var i = 1; i < materials.length; i++) { //Tries all materials apart from the default one
		var fitVal = (((oldDef + 1) * t.material.yModulus / materials[i].yModulus) - 1) * w[0]
			   		+ (((oldWeight + 1) * materials[i].density / t.material.density ) - 1) * w[1]
			   		+ (((oldCost + 1) * materials[i].cost / t.material.cost) - 1) * w[2];
		fitness.push(fitVal); //Adds to the end of the array
	}
	var index = fitness.indexOf(min(fitness)) + 1; //Fids the index of the best material
	document.getElementById("RecMat_Label").innerHTML = materials[index].name;
}
