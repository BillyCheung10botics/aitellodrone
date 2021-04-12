
var count = 0
async function recurfunc () {
    if (count < 5) {
        setTimeout( function () {
            count += 1;
            console.log(`this function ran ${count} times.`)
            recurfunc();
        }, 500);
    } else {
        return true;
        // return new Promise(resolve => {resolve(true);});
    }
}

result = recurfunc();
result.then(res => {console.log("Fuck My Life");console.log(res);})
console.log("not in async function");
console.log(`The result is : ${result}`);
// console.log(recurfunc())


// function getResult() {
//     return new Promise(resolve => {const result = recurfunc(); resolve(result);});
//     // const result = await recurfunc();
//     // console.log("in async function");
//     // console.log(result);
// }

// async function getResultWait() {
//     const result = await getResult();
//     console.log(result);
//     return result;
// }

// const result = getResultWait();
// // console.log(getResultWait());
// getResult().then((res) => {console.log(res);})


