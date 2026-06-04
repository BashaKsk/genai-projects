



// console.log("Prototype")

// const object = {
//     name: "BAsha",
//     age: 25,
//     print: function () {
//         console.log(`${this.name} age is ${this.age}`)
//     }
// }

// console.log(object.print());

// const object1 = {
//     name: "Ksk"
// }

// Object.setPrototypeOf(object1, object)

// object.age = 30

// object1.print()


// /// Call, Apply, Bind

// function whoAmI() {
    
    
//     return console.log(this.name);
// }


// const user = {name:"Basha", whoAmI,}

// user.whoAmI()

// const fn = user.whoAmI;

// fn() // undefined


// // solution for it 

// fn.call(user)  /// every time we shold attact object


// // bind
// const bound = fn.bind(user) // one time attach 

// bound()

// const bound1 = bound

// bound1()

// // apply

// fn.apply(user)

// const scores = [23,45,3,90]


// console.log(Math.max(scores)); // NaN — it can't read an array

// console.log(Math.max.apply(null, scores)); // 90

// //modern way
// console.log(Math.max(...scores));


// // types //
// console.log(typeof(null));
// console.log(typeof(undefined));
// console.log(typeof(Nan));
// console.log(typeof(Error));
// console.log(typeof({}));
// console.log(typeof([]));

// // order
// function order(item, qty, note) {
    
//     return `${this.name} ordered ${qty} * ${item} (${note})`
// }



// const customer = {name: "Basha"}



// // call with arguments

// console.log(order.call(customer, "Pizza", 5 , "Extra chsee"));


// // apply with arguments

// console.log(order.apply(customer, ["Pizza", 5 , "Extra chsee"]));


// // bind with arguments


// const bashaOrder = order.bind(customer, "Pizza")

// console.log(bashaOrder(5, "Extra Cheese"))



// function greet(greeting, name) { return `${greeting}, ${name}!`; }
// const sayHello = greet.bind(null, "Hello");

// console.log(sayHello("basha"));



// // Closurees

// function outer() {

//     let message = "message"

//     return function inner() {
//         console.log(message)
        
//     }
// }


// const myFn = outer()

// myFn()