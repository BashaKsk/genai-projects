// Scope means where we can access a speciafic var, function in our code

// Scope is Direclty related to lexical environment

// lexical environment is local memory alogn with lexical environment of it's parent


function a() {
  var b = 10;

  c();

  function c() {
    console.log(b);
  }
}

a();

console.log(b);


// Scope chain is the chain of lexical environments formed by parents references.
// When JavaScript cannot find a variable in the current scope, it traverses the scpe chain unitl the variable is found or the global scope is reached.
