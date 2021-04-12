//1. Create a new function that returns a promise
function firstFunction() {
    return new Promise((resolve, reject) => {
        let y = 0
        setTimeout(() => {
            for(i=0; i<10; i++){
                y++
            }
            console.log('loop completed')  
            resolve(y)
        }, 2000)
    })
    }
    
    //2. Create an async function
    async function secondFunction() {
        console.log('before promise call')
        //3. Await for the first function to complete
        let result = await firstFunction()
        console.log('promise resolved: ' + result)
        console.log('next step')
    }; 

    secondFunction()