# Evolutionary Truss Analysis
Improves truss structures with a genetic algorithm.

![alt text](https://github.com/jb-c/trussevolution/blob/master/Media/readmepic.png "Before and After")

[Live Demo](https://evolutionarytrussanalasis.000webhostapp.com/Pages/Home_Page.html) (Only rested on desktop chrome for windows 10)

## How This Works
1. The user enters a truss design and criteria they want to optimize.
2. The truss is cloned to make a population.
3. Each truss in the population is encoded into a bitstring.
4. The bitstrings are then randomly mutated.
5. The trusses are reconstructed from the bitstrings and analysed.
6. The best trusses are 'bred' together and the worst ones are removed from the population.
7. Steps 3 to 6 are repeated until a desited stopping criteria is met.
