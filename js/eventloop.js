

/// Event Loop



// The Event Loop is a mechanism that continuously monitors the Call Stack and Callback Queue, 
// moving callbacks from the queue to the stack when the stack becomes empty.



//The Callback Queue stores callback functions that are ready to be executed after asynchronous operations complete.


// new Promise((resove, reject) => {



//     setTimeout(()=> {
       
// console.log("Promise Resolved");
//         resove()
        
//     }, 5000)
// }).then(() => {
//     console.log("Promise called");
    
// })




    // setTimeout(()=> {
    //     console.log("TimeOut");        
    // }, 5000)

console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
}).finally(() => {
    console.log("finally");
    
});

console.log("End");


// console.log("Start");

// setTimeout(() => {
//     console.log("Timeout Callback");
// }, 5000);

// fetch("https://jsonplaceholder.typicode.com/todos/1")
//     .then((res) => res.json())
//     .then((data) => {
//         console.log("Fetch Callback");
//     });

// console.log("End");