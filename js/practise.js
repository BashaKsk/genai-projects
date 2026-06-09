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


// -------------------------------------------------------------
// Q6 — TWO POINTERS  "Two Sum II (sorted input)"
//
// Given a SORTED array and a target, return the [i, j] indices
// (0-based) of the two numbers that add up to target. Exactly one
// solution exists. Aim for O(n) time, O(1) space (no hashmap).
//
// Examples:
//   twoSumSorted([2,7,11,15], 9)  -> [0,1]   (2+7)
//   twoSumSorted([2,3,4], 6)      -> [0,2]   (2+4)
//   twoSumSorted([-1,0], -1)      -> [0,1]
//
// Hint: a pointer at each end. If sum is too big, move right pointer
// left; if too small, move left pointer right.
// -------------------------------------------------------------
function twoSumSorted(nums, target) {
  // your code here

    const seen = new Map()

    for (let i=0; i < nums.length; i++) {

        const current  = nums[i]

        const needed = target - current

        if(seen.has(needed)) {
          return [seen.get(needed), i]
        }

        seen.set(current, i)
    }
}


// -------------------------------------------------------------
// Q7 — SLIDING WINDOW  "Longest Substring Without Repeating Chars"
//
// Given a string, return the LENGTH of the longest substring with
// all unique characters.
//
// Examples:
//   lengthOfLongest("abcabcbb") -> 3   ("abc")
//   lengthOfLongest("bbbbb")    -> 1   ("b")
//   lengthOfLongest("pwwkew")   -> 3   ("wke")
//   lengthOfLongest("")         -> 0
//
// Hint: a window [left..right]. Use a Set of chars in the window.
// When you hit a duplicate, shrink from the left until it's gone.
// -------------------------------------------------------------
function lengthOfLongest(s) {
  // your code here
  const seen = new Set();

  let left = 0;
  let maxLen = 0;

  for(let right=0; right < s.length; right++)
     {

      while(seen.has(s[right])) {
        
        seen.delete(s[left])

        left++
      }

      seen.add(s[right])

      maxLen = Math.max(maxLen, right - left +1)

    }
  
    return maxLen;
  
}


// -------------------------------------------------------------
// Q8 — BINARY SEARCH  "Search in Sorted Array"
//
// Given a SORTED array and a target, return its index, or -1 if not
// present. Must be O(log n) (do NOT use indexOf).
//
// Examples:
//   binarySearch([-1,0,3,5,9,12], 9) -> 4
//   binarySearch([-1,0,3,5,9,12], 2) -> -1
//   binarySearch([5], 5)             -> 0
//
// Hint: lo=0, hi=n-1. Look at mid; if too small search right half,
// if too big search left half. Careful with the loop condition.
// -------------------------------------------------------------
function binarySearch(nums, target) {
  // your code here

let lo = 0

let hi = nums.length -1

while(lo <= hi) {

  const mid = Math.floor((lo+hi) / 2);

  if(nums[mid] === target) return mid;

  if(nums[mid] < target ) lo=mid+1;

  else hi = mid - 1
  
}

return -1;

}


// -------------------------------------------------------------
// Q9 — LINKED LIST  "Reverse a Linked List"
//
// Reverse a singly linked list and return the new head.
// A node looks like: { val: number, next: node|null }.
// Helpers below build a list from an array and read it back.
//
// Examples:
//   toArray(reverseList(toList([1,2,3]))) -> [3,2,1]
//   toArray(reverseList(toList([1])))     -> [1]
//   reverseList(null)                     -> null
//
// Hint: walk the list keeping prev/curr/next pointers; flip each
// node's `next` to point backward. Iterative is fine.
// -------------------------------------------------------------
function reverseList(head) {
  let prev = null;   // the reversed part so far; original head becomes the tail (-> null)
  let curr = head;   // the node we're currently flipping

  while (curr !== null) {
    const next = curr.next; // 1. SAVE the rest of the list before we overwrite the pointer
    curr.next = prev;       // 2. FLIP this node's arrow to point backward
    prev = curr;            // 3. advance prev forward (curr is now part of the reversed list)
    curr = next;            // 4. advance curr forward using the saved pointer
  }

  return prev; // curr is null; prev is the last node flipped = the new head
}


// =============================================================
// TEST RUNNER — don't edit; this prints pass/fail for you.
// =============================================================
function toList(arr) {            // array -> linked list, returns head
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) head = { val: arr[i], next: head };
  return head;
}
function toArray(head) {          // linked list -> array
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
}
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

check("Q6 [2,7,11,15] t9", twoSumSorted([2,7,11,15], 9), [0,1]);
check("Q6 [2,3,4] t6",     twoSumSorted([2,3,4], 6), [0,2]);
check("Q6 [-1,0] t-1",     twoSumSorted([-1,0], -1), [0,1]);

check("Q7 abcabcbb", lengthOfLongest("abcabcbb"), 3);
check("Q7 bbbbb",    lengthOfLongest("bbbbb"), 1);
check("Q7 pwwkew",   lengthOfLongest("pwwkew"), 3);
check("Q7 empty",    lengthOfLongest(""), 0);

check("Q8 find 9",    binarySearch([-1,0,3,5,9,12], 9), 4);
check("Q8 missing 2", binarySearch([-1,0,3,5,9,12], 2), -1);
check("Q8 single",    binarySearch([5], 5), 0);

check("Q9 [1,2,3]", toArray(reverseList(toList([1,2,3]))), [3,2,1]);
check("Q9 [1]",     toArray(reverseList(toList([1]))), [1]);
check("Q9 null",    reverseList(null), null);
