// ============================================================
//                 JS ENGINE ARCHITECTURE
// ============================================================
//
// JavaScript is NOT directly understood by the computer.
// It first goes through the JS Engine (e.g. V8 in Chrome/Node,
// SpiderMonkey in Firefox, JavaScriptCore in Safari).
//
// Whole Browser/Node = JS Runtime Environment
//   = JS Engine + Web APIs + Callback Queue + Microtask Queue + Event Loop
//
//
//                       CODE  (your .js file)
//                         |
//                         v
//   +----------------------------------------------------+
//   |                    JS ENGINE                        |
//   |                                                     |
//   |   1) PARSING                                        |
//   |        - Code is broken into TOKENS                 |
//   |          e.g.  let a = 7   ->  "let", "a", "=", "7" |
//   |        - The SYNTAX PARSER converts tokens into an  |
//   |          AST (Abstract Syntax Tree)                 |
//   |          (a tree-shaped object describing the code) |
//   |                                                     |
//   |   2) COMPILATION   (JIT - Just In Time)             |
//   |        - AST -> bytecode (Interpreter: Ignition)    |
//   |        - Hot code gets optimized to machine code    |
//   |          (Compiler: TurboFan)                       |
//   |        - JS uses BOTH interpreter + compiler = JIT  |
//   |                                                     |
//   |   3) EXECUTION                                      |
//   |        - Runs inside the Call Stack                 |
//   |        - Uses the Memory Heap to store objects      |
//   |          and variables                              |
//   +----------------------------------------------------+
//
//
//   CODE  -->  PARSING  -->  COMPILATION  -->  EXECUTION
//
//   TOKENS:    let a = 7  ->  ["let", "a", "=", "7"]
//   AST:       a tree object describing the program
//
// ------------------------------------------------------------
// THE THREE STAGES IN DETAIL
// ------------------------------------------------------------
//
// 1) PARSING
//    -> Tokenizer / Lexer splits the source code into tokens.
//    -> Syntax Parser reads the tokens and builds the AST.
//    -> See https://astexplorer.net to visualise the AST.
//
// 2) COMPILATION  (modern engines use JIT)
//    -> Old days: JS was purely interpreted (slow but instant start).
//    -> Today: Interpreter starts running bytecode immediately,
//       while the Compiler optimizes frequently used ("hot") code
//       into fast machine code in the background.
//    -> Best of both worlds = Just In Time (JIT) compilation.
//
// 3) EXECUTION
//    -> Needs two things: Memory Heap + Call Stack.
//    -> Memory Heap : unstructured memory where variables/objects live.
//    -> Call Stack  : tracks which function is currently running
//                     (LIFO - Last In, First Out).
//
//
// V8 ENGINE (used by Chrome & Node.js)
//   - Ignition  : the interpreter (generates & runs bytecode)
//   - TurboFan  : the optimizing compiler (produces machine code)
//   - Orinoco   : the garbage collector (frees unused memory)
//
// ============================================================


// ---- tiny demo: how the engine "sees" a line of code ----

// SOURCE CODE
const sourceCode = "let a = 7;";

// 1) PARSING -> TOKENS (what a tokenizer roughly produces)
const tokens = [
    { type: "keyword",    value: "let" },
    { type: "identifier", value: "a" },
    { type: "operator",   value: "=" },
    { type: "number",     value: "7" },
    { type: "punctuator", value: ";" },
];

// 1) PARSING -> AST (what the syntax parser builds from those tokens)
const ast = {
    type: "VariableDeclaration",
    kind: "let",
    declarations: [
        {
            type: "VariableDeclarator",
            id:   { type: "Identifier", name: "a" },
            init: { type: "Literal", value: 7 },
        },
    ],
};

console.log("SOURCE :", sourceCode);
console.log("TOKENS :", tokens);
console.log("AST    :", JSON.stringify(ast, null, 2));


// ---- demo: the Call Stack used during EXECUTION (LIFO) ----

function third() {
    console.log("3) third() running   -> top of the Call Stack");
}

function second() {
    console.log("2) second() running  -> calls third()");
    third();
}

function first() {
    console.log("1) first() running   -> calls second()");
    second();
}

// Call Stack grows:  first -> second -> third
// then unwinds:      third pops -> second pops -> first pops -> empty
first();

// Summary:
// CODE -> (Parsing: Tokens + Syntax Parser -> AST)
//      -> (Compilation: JIT -> bytecode/machine code)
//      -> (Execution: Memory Heap + Call Stack)
