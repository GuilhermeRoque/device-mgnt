// Prints the items which are put
// in a knapsack of capacity W
function resolveKnapsackProblem(W, wt, val){
    let indexes = []
    let weights = []
    let n = val.length

    let i, w;
    let K = new Array(n + 1);
    for( i=0;i<K.length;i++)
    {
        K[i]=new Array(W+1);
        for(let j=0;j<W+1;j++)
        {
            K[i][j]=0;
        }
    }

    // Build table K[][] in bottom up manner
    for (i = 0; i <= n; i++) {
        for (w = 0; w <= W; w++) {
            if (i == 0 || w == 0)
                K[i][w] = 0;
            else if (wt[i - 1] <= w){
                K[i][w] = Math.max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
            }
            else
                K[i][w] = K[i - 1][w];
        }
    }
   
    // stores the result of Knapsack
    const valueSum = K[n][W];
    let res = valueSum
    w = W;
    for (i = n; i > 0 && res > 0; i--){

        // either the result comes from the top
        // (K[i-1][w]) or from (val[i-1] + K[i-1]
        // [w-wt[i-1]]) as in Knapsack table. If
        // it comes from the latter one/ it means
        // the item is included.
        if (res == K[i - 1][w])
            continue;
        else {

            // This item is included.
            indexes.push(i-1)
            weights.push(wt[i-1])
            // Since this weight is included its
            // value is deducted
            res = res - val[i - 1];
            w = w - wt[i - 1];
        }
    }
    return {total: weights.reduce((partialSum, a) => partialSum + a, 0), indexes: indexes, weights:weights}
}


function getAllCombinations(W, wt, val){
    let valIndexes = []
    let allCombinations = []
    let valHelp = [...val]
    let wtHelp = [...wt]

    for(let i=0; i < valHelp.length; i++){
        if(wtHelp[i] > W){
            allCombinations.push([valHelp[i]])
            val.splice(i, 1)            
            wt.splice(i, 1)
        }
    }

    for(let i=0; i < val.length; i++){
        valIndexes.push(wt[i])
    }

    while(wt.length){
        let result = resolveKnapsackProblem(W, wt, valIndexes)
        let resultCombination = []
        for(const index of result.indexes){
            resultCombination.push(val.splice(index, 1)[0])
            valIndexes.splice(index, 1)
            wt.splice(index, 1)
        }
        allCombinations.push(resultCombination)
    }
    return allCombinations
}

function getAllCombinationsFixSize(L, wt, val){
    if(L===1){
        return val
    }
    const total = wt.reduce((partialSum, a) => partialSum + a, 0);
    let W = total/L
    if (W%1) {
        W = Math.floor(W+1)
    }
    let maxValue = Math.max(...wt)
    if (W < maxValue){
        W = maxValue
    }
    let allCombinations =  getAllCombinations(W, wt, val)
    
    if (allCombinations.length > L){
        let extraCombinations = allCombinations.splice(L, allCombinations.length - L)
        allCombinations[L-1] = [allCombinations[L - 1], ...extraCombinations]
        allCombinations[L-1] = allCombinations[L-1].flat()
    }
    return allCombinations

}   

module.exports = {
    resolveKnapsackProblem: resolveKnapsackProblem,
    getAllCombinations: getAllCombinations,
    getAllCombinationsFixSize: getAllCombinationsFixSize

}