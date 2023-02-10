const {resolveKnapsackProblem, getAllCombinations, getAllCombinationsFixSize} = require("../src/resources/application/knapsackProblem")
const {expect} = require("chai")

describe('Tests Knapsack', () => {
    it('Get all combinations with smaller values', () => {
        let W = 50
        let wt = [10, 20, 30]
        let vt = ["A", "B", "C"]
        let allCombinations = getAllCombinations(W, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'C', 'B' ], [ 'A' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations with smaller and greater values', () => {
        let W = 50
        let wt = [10,  20,  30,   5,   60]
        let vt = ["A", "B", "C", "D", "E"]
        let allCombinations = getAllCombinations(W, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'C', 'B', 'A' ], [ 'E' ], [ 'D' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations for fix num of combinations size=1', () => {
        let wt = [10, 20, 30, 5, 60]
        let vt = ["A", "B", "C", "D", "E"]
        let allCombinations = getAllCombinationsFixSize(1, wt, vt)
        let expectedResult = ["A", "B", "C", "D", "E"]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations for fix num of combinations size=2', () => {
        let wt = [10, 20, 30, 5, 60]
        let vt = ["A", "B", "C", "D", "E"]
        let allCombinations = getAllCombinationsFixSize(2, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'C', 'B', 'A' ], [ 'E', 'D' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations for fix num of combinations size=3', () => {
        let wt = [10,  20,  30,  60, 5]
        let vt = ["A", "B", "C", "E", "D"]
        let allCombinations = getAllCombinationsFixSize(3, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'C', 'B', 'A' ], [ 'E',], ['D' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations decimals size=3', () => {
        let wt = [0.1, 0.2, 0.3, 0.05, 0.6]
        let vt = ["A", "B", "C", "D", "E"]
        let allCombinations = getAllCombinationsFixSize(3, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'C', 'B', 'A' ], [ 'E',], ['D' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations decimals greater than 1 size=3', () => {
        let wt = [ 1.7, 3.4, 5.1, 8.5, 10.2 ]
        let vt = ["A", "B", "C", "D", "E"]
        let allCombinations = getAllCombinationsFixSize(3, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'D', 'A' ], [ 'E' ], [ 'C', 'B' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });

    it('Get all combinations decimals greater than 1 size=3', () => {
        let wt = [ 1, 1, 1, 2, 2 ]
        let vt = ["A", "B", "C", "D", "E"]
        let allCombinations = getAllCombinationsFixSize(3, wt, vt)
        console.log("ALL COMBINATIONS", allCombinations)
        let expectedResult = [ [ 'C', 'B', 'A' ], [ 'D' ], [ 'E' ] ]
        expect(allCombinations).to.deep.equal(expectedResult)
    });
    
});
