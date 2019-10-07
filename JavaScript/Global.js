//This file contains global variables/data structures, for ease of modification

//General data structures
var Trusses = []; //Defines the main Trusses array

//General values for the genetic algorithm
const populationSize = 60; //Number of trusses in population
var iterationCount = 0; //Counter to track number of iterations done

//Values affecting the bitstring and likely-hood of mutations
const TrussMutationProb = 0.75; //Probability that a random truss is mutated, per iteration (0<x<=1)
const BitMutProb = 0.075; //Chance a randomly selected bit is flipped, for a truss which is mutated (0<x<=1)
const DontMutate = 0.15; //Top % of trusses not to mutate (0<=x<1)
const extraBits = 0; //Number of extra bits to add per property in the bitstring (0<=x)

//Values affecting the removal of trusses from the array
const StrictThreshold = 0.4; //Percentage of trusses to remove strictly (0<x<1)
const Analyticalmultiplier = 2; //Number of standard deviations away to remove data (0<x<=3)
const AnalyticalCalculationVal = 0.5; //Top % of trusses to Calculate standard deviation from (0<x<1)

//Values affecting the breeding and repopulation of the array
const RepopulateMixed = 0.1; //Probability one parent is from bottom 50%, and one is from top 50% (0<=x<1)
const CrossoverInterval = 7; //Sets the number of bits to select/alternate from each parent (0<x<Reasonably small<25) - Int

//Values used to create graphs
var FitnessData = []; //An array to store fitness values, to produce a graph
var DefData = []; //An array to store deformation values, to produce a graph
var WeiData = []; //An array to store weight values, to produce a graph
var CostData = []; //An array to store cost values, to produce a graph
var HeightData = []; //An array to store height values, to produce a graph

//Values affecting the calculation of the fitness function
const beamRad = 0.01; //Defines the radius of the members
const materials = [ //Creates an array containing materials data
    {"name":"Default","cost":1,"density":1,"yModulus":1,"id":0},
    {"name":"Alumina","cost":1.37,"density":3900,"yModulus":390,"id":1},
    {"name":"Aluminum alloy","cost":1.30,"density":2700,"yModulus":70,"id":2},
    {"name":"Beryllium alloy","cost":226.80,"density":2900,"yModulus":245,"id":3},
    {"name":"Brass","cost":1.58,"density":8400,"yModulus":130,"id":4},
    {"name":"Cermets","cost":56.59,"density":11500,"yModulus":470,"id":5},
    {"name":"CFRP Laminate","cost":79.20,"density":1500,"yModulus":1.5,"id":6},
    {"name":"Concrete","cost":0.04,"density":2500,"yModulus":48,"id":7},
    {"name":"Copper alloys","cost":1.62,"density":8300,"yModulus":135,"id":8},
    {"name":"Cork","cost":7.16,"density":180,"yModulus":0.032,"id":9},
    {"name":"Epoxy thermoset","cost":3.96,"density":1200,"yModulus":3.5,"id":10},
    {"name":"GFRP Laminate (glass)","cost":2.81,"density":1800,"yModulus":26,"id":11},
    {"name":"Glass (soda)","cost":0.97,"density":2500,"yModulus":65,"id":12},
    {"name":"Granite","cost":2.27,"density":2600,"yModulus":66,"id":13},
    {"name":"Ice","cost":0.17,"density":920,"yModulus":9.1,"id":14},
    {"name":"Lead alloys","cost":0.86,"density":11100,"yModulus":16,"id":15},
    {"name":"Nickel alloys","cost":4.39,"density":8500,"yModulus":180,"id":16},
    {"name":"Polyamide (nylon)","cost":3.10,"density":1100,"yModulus":3.0,"id":17},
    {"name":"Polybutadiene elastomer","cost":0.86,"density":910,"yModulus":0.0016,"id":18},
    {"name":"Polycarbonate","cost":3.53,"density":1200,"yModulus":2.7,"id":19},
    {"name":"Polyester thermoset","cost":2.16,"density":1300,"yModulus":3.5,"id":20},
    {"name":"Polyethylene (HDPE)","cost":0.72,"density":950,"yModulus":0.7,"id":21},
    {"name":"Polypropylene","cost":0.79,"density":890,"yModulus":0.9,"id":22},
    {"name":"Polyurethane elastomer","cost":2.88,"density":1200,"yModulus":0.025,"id":23},
    {"name":"Polyvinyl chloride (rigid PVC)","cost":1.08,"density":1400,"yModulus":1.5,"id":24},
    {"name":"Silicon","cost":1.69,"density":2300,"yModulus":110,"id":25},
    {"name":"Silicon Carbide (SiC)","cost":25.92,"density":2800,"yModulus":450,"id":26},
    {"name":"Spruce (parallel to grain)","cost":0.72,"density":600,"yModulus":9,"id":27},
    {"name":"Steel, high strength 4340","cost":0.18,"density":7800,"yModulus":210,"id":28},
    {"name":"Steel, mild 1020","cost":0.36,"density":7800,"yModulus":210,"id":29},
    {"name":"Steel, stainless austenitic 304","cost":1.94,"density":7800,"yModulus":210,"id":30},
    {"name":"Titanium alloy (6Al4V)","cost":11.70,"density":4500,"yModulus":100,"id":31},
    {"name":"Tungsten Carbide (WC)","cost":36.00,"density":15500,"yModulus":550,"id":32}
];
