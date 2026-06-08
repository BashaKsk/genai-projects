function x() {

    console.log("X");
    

}


function y(x) {
    x()
}

y(x);

const radius = [3,1,2,4]

const area =  (radius) => Math.PI * radius * radius;

const circumference = (radius) => Math.PI * radius;

const diameter = (radius) => 2 * radius;

const calculate =  (radius, logic ) => radius.map(logic);

console.log(calculate(radius, area));

console.log(calculate(radius, circumference));

console.log(calculate(radius, diameter));


radius.map(console.log)



