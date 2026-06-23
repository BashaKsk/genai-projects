//=====Functions============


// Function Statement aka Function Declaration
function a() 
{
  console.log("a is called");
}


console.log(a.name);

// Funciton Expression

console.log(b);

var b = function() 
{
console.log("b is called");

}

console.log(b.name);


// Anonymous Function

// function (){

// }

// Named function express

var named = function namedfe() {
  console.log("Named function expression");

  console.log(namedfe);
  
}


named()


// Difference between parameters and arguments


function add(a,b) { // parametetrs
  return a+b;
}

add(1,2) // arguments

// First class function

function x(param) {

param()


return function() {
 return "can also be return"
}
  
}

function y() {
  console.log("first class func");
}

x(y)

// Arrow Function

