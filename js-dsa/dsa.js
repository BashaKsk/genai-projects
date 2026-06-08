// Valid Parenthesis 


function isvalidParenthesis(str) {

    const stack = [];

    const pairs = {
    ')' : '(',
    '}' : '{',
    ']' : '['
    }

    for(const char of str){

        if(!pairs[char]) {

            stack.push(char)
            continue
        }


        if(stack.pop() !== pairs[char]){
            return false
        }
    }

    return stack.length === 0
}
