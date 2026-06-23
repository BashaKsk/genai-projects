function x() {

     let a = 7;
 

  function y() {

    var a = 10;

    console.log(a);
  }



  return y;
}

var y = x();

y();

// A closure is a function bundled together with its lexical environment.

function z() {
  var b = 900;
  function x() {
    const a = 7;

    function y() {
      console.log(a, b);
    }
    y();
  }

  x();
}

z();

// Interview Questions

function a() {


for (var i = 1; i < 5; i++) {

    function close(x) {

        setTimeout(() => {
                console.log(x);
        
        }, x * 1000);
    }

  
    close(i)
    
}

}

a();

// Easy fix 

for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}


function counter() {
  
  var count = 0;
  
  return {
    increment : () => ++count,
    decrement: () => --count
  }
}


const counter1 = counter();

console.log(counter1.increment());
console.log(counter1.decrement());

const counter2 = counter();

console.log(counter2.increment());
console.log(counter2.increment());
console.log(counter2.increment());
console.log(counter2.decrement());


