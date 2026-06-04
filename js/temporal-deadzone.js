// let & const declarations are hoisted 

// Temorial Deadzone:  Memory is allocated for let and const in variables during the creation phase, 
// but the remain uninitialized unitl the declaration is executed. 
// This period during which they cannot be accessed is called Temporial Dead Zone

// console.log(a);

var x = 1

let y = 2;

// b=""

// for(var x= 0; x<5; x++ ) {
//     setTimeout(() => {console.log(x)}, x *1000)
// }


// Block Scope && Shadowing

{
    // Compund Statement


    var x=10;

    let y= 100;

    const c = 1000;
    

    console.log(x);
    console.log(y);
    console.log(c);



}

console.log(x);
console.log(y);
// console.log(c);



if(true)console.log("Valid");



var z= 10;

(() => {
    var z = 100
    console.log(z);
})();


(() => {
   console.log("Hello");
})();


console.log(z);


// Shadowing:  An inner variable hides (shadows) a variable with the same name from an outer scope.


const k = 1;

{
    const k = 2;

    // var k = 12;

    {
        const k = 3;

        console.log(k);
        
    }

     console.log(k);
}

 console.log(k);