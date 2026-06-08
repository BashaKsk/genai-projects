// What is Callback Fnction in Javascript
// Callback is a funciton which is being passed as an argument to another function

function x(y){

console.log("x");

y()


}


x(function y() {
    console.log("it a call back: y");
    
})

//async task

setTimeout(()=> {
console.log("its a call back: setTimout");

}, 5000)





function attachEventListeners() {
    let count = 0
    
    document.getElementById("clickMe").addEventListener("click", function xyz() {
        console.log("Button is clicked", ++count);
        
    })
}



attachEventListeners()