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
    let allCombinations = []

    
    let minW = Math.min(...wt)
    if(minW < 1){
        let multiple = 1/minW
        for(let i =0; i<wt.length; i++){
            wt[i] = wt[i]*multiple
        }
        W = W*multiple
    }
    for(let i =0; i<wt.length; i++){
        if(wt[i]%1){
            wt[i] = Math.floor(wt[i]+1)
        }
    }
    if(W%1){
        W = Math.floor(W+1)   
    }


    // for(let i=0; i < wt.length; i++){
    //     if(wt[i] > W){
    //         allCombinations.push([val[i]])
    //         wt.splice(i, 1)
    //         val.splice(i, 1)
    //         i--
    //     }
    // }
    let max = Math.max(...wt)
    if (W < max){
        W=max
    }
    while(wt.length){
        let result = resolveKnapsackProblem(W, wt, wt)
        let resultCombination = []
        // console.log(wt)
        // console.log(val)
        // console.log(W)    
        // console.log(result.indexes)
        // console.log("--------------------------")
        for(let j=0;j<result.indexes.length;j++){
            let index = result.indexes[j]
            resultCombination.push(val.splice(index, 1)[0])
            wt.splice(index, 1)
            for(let i=j+1;i<result.indexes.length;i++){
                if(result.indexes[i] > index){
                    result.indexes[i] = result.indexes[i] + 1
                }

            }

        }
        allCombinations.push(resultCombination)
    }
    return allCombinations
}

function getAllCombinationsFixSize(L, wt, val){
    if(L===1){
        return [val]
    }
    const total = wt.reduce((partialSum, a) => partialSum + a, 0);
    let W = total/L

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