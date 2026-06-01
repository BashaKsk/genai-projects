// =============================================================
// Amazon Support Engineer — DSA Practice
// Format: you solve, I coach. Fill in each function, save, and
// tell me you're done. Run with:  node js/practise.js
// =============================================================


// -------------------------------------------------------------
// Q1 — HASHMAPS & SETS  (warm-up)
// "First Unique Character"
//
// Given a string s, return the INDEX of the first character that
// appears exactly once. If there is none, return -1.
//
// Examples:
//   firstUniqChar("leetcode")     -> 0   ('l')
//   firstUniqChar("loveleetcode") -> 2   ('v')
//   firstUniqChar("aabb")         -> -1
//
// Aim: O(n) time. Think: count frequencies, then scan again.
// -------------------------------------------------------------
function firstUniqChar(s) {
  // your code here

  const fre = new Map();

  for(let i=0; i < String(s).length; i++) {

            fre.set(s[i], (fre.get(s[i]) ?? 0) + 1)
    
  }

  for(let i=0; i < String(s).length; i++) {
    if(fre.get(s[i]) === 1){
        return i
    }
  }

   return -1 

}


// -------------------------------------------------------------
// Q2 — STACKS  (classic, asked a LOT at Amazon)
// "Valid Parentheses"
//
// Given a string containing only the characters  ()[]{}  determine
// if the brackets are balanced and correctly nested.
//
// Examples:
//   isValid("()")     -> true
//   isValid("()[]{}") -> true
//   isValid("(]")     -> false
//   isValid("([)]")   -> false
//   isValid("{[]}")   -> true
//
// Aim: O(n) time using a stack.
// -------------------------------------------------------------
function isValid(s) {
  // your code here

  const stack = []

  const pairs = {
    '}' : '{',
    ')' : '(',
    ']' : '[',
  }

  for(const char of s) {
    if(!pairs[char]){
        stack.push(char)
        continue
    }

    if(stack.pop() !==pairs[char]){
    return false
  }
  }


  return stack.length ===0




}


// -------------------------------------------------------------
// Q3 — MAP  "Group Anagrams"
//
// Given an array of strings, group the ones that are anagrams of
// each other. Return an array of groups. Order of groups and order
// within a group don't matter for the check below (we sort first).
//
// Examples:
//   groupAnagrams(["eat","tea","tan","ate","nat","bat"])
//     -> [["eat","tea","ate"], ["tan","nat"], ["bat"]]
//   groupAnagrams([""])  -> [[""]]
//   groupAnagrams(["a"]) -> [["a"]]
//
// Hint: two anagrams share the same SORTED letters ("eat"->"aet").
// Use that sorted string as a Map key; value = array of words.
// Aim: O(n * k log k) where k = max word length.
// -------------------------------------------------------------
function groupAnagrams(words) {
  // your code here
  const group = new Map();

  for(const w of words) {

    const sorted= String(w).split("").sort().join("");

    if(!group.has(sorted)) group.set(sorted,[]);

    group.get(sorted).push(w);

  }

  return [...group.values()]
}


// -------------------------------------------------------------
// Q4 — MAP + ARRAY  "Top K Frequent Elements"
//
// Given an array of numbers and a number k, return the k most
// frequent elements (any order).
//
// Examples:
//   topKFrequent([1,1,1,2,2,3], 2) -> [1,2]
//   topKFrequent([1], 1)           -> [1]
//   topKFrequent([4,4,5,5,5,6], 2) -> [5,4]
//
// Hint: count with a Map, then sort entries by count desc, take k.
// -------------------------------------------------------------
function topKFrequent(nums, k) {
  // your code here

  const fre = new Map();

  for(let i=0; i < nums.length; i++) {

        fre.set(nums[i], (fre.get(nums[i]) ?? 0) + 1)
  }

  const ans =  [...fre.entries()].sort((a, b) => b[1] - a[1]).slice(0,k).map(([i]) => i)

  return ans;
  
}


// -------------------------------------------------------------
// Q5 — RECURSION  "Sum Nested Array"
//
// Given an array that may contain numbers OR nested arrays (any
// depth), return the sum of all the numbers.
//
// Examples:
//   sumNested([1, 2, 3])              -> 6
//   sumNested([1, [2, [3, [4]]]])     -> 10
//   sumNested([])                     -> 0
//   sumNested([1, [], [2, [3]], 4])   -> 10
//
// Hint: loop the array; if an element is itself an array, recurse
// into it; otherwise add the number. (Array.isArray helps.)
// -------------------------------------------------------------
function sumNested(arr) {
  // your code here

  let sum = 0

  for(const a of arr) {

    if(Array.isArray(a)) {
      sum  += sumNested(a)
    }else{
        sum +=a
    }
  }

  return sum
}


// =============================================================
// TEST RUNNER — don't edit; this prints pass/fail for you.
// =============================================================
function sortGroups(groups) {
  // normalize so order doesn't matter when comparing
  return groups.map(g => [...g].sort()).sort((a, b) => (a[0] > b[0] ? 1 : -1));
}
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
}

check("Q1 leetcode",     firstUniqChar("leetcode"), 0);
check("Q1 loveleetcode", firstUniqChar("loveleetcode"), 2);
check("Q1 aabb",         firstUniqChar("aabb"), -1);

check("Q2 ()",     isValid("()"), true);
check("Q2 ()[]{}", isValid("()[]{}"), true);
check("Q2 (]",     isValid("(]"), false);
check("Q2 ([)]",   isValid("([)]"), false);
check("Q2 {[]}",   isValid("{[]}"), true);

check("Q3 anagrams", sortGroups(groupAnagrams(["eat","tea","tan","ate","nat","bat"])),
                     sortGroups([["eat","tea","ate"],["tan","nat"],["bat"]]));
check("Q3 empty",    groupAnagrams([""]), [[""]]);

check("Q4 [1,1,1,2,2,3]", topKFrequent([1,1,1,2,2,3], 2).sort(), [1,2]);
check("Q4 [1]",           topKFrequent([1], 1), [1]);
check("Q4 [4,4,5,5,5,6]", topKFrequent([4,4,5,5,5,6], 2).sort(), [4,5]);

check("Q5 flat",   sumNested([1,2,3]), 6);
check("Q5 nested", sumNested([1,[2,[3,[4]]]]), 10);
check("Q5 empty",  sumNested([]), 0);
check("Q5 mixed",  sumNested([1,[],[2,[3]],4]), 10);
