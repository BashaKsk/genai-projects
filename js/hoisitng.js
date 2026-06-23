//================ Hoisting====================
console.log(getVarName);
// getVarName() // TypeCaught Error cos vit's undefined not func
getName()
console.log(x)
console.log(getVarName())

var x= 7

function getName() {
    console.log("Namaster Javascript")
}

var getVarName = () => {
    console.log("Namaster Var Name")
}

// getName()

// console.log(getName) // print the funciton itself


// Hoisting is the process by which JavaScript allocates memory for variables and functions before executing the code.