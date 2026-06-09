// =============================================================
// Amazon Phone Screen — TREES practice  (run: node js/treesPractice.js)
// Format: you solve Q2–Q5, save, run. Q1 is WORKED as your guide.
//
// Node shape:  { val: number, left: node|null, right: node|null }
//
// Two core patterns you'll reuse everywhere:
//   • DFS (recursion): solve(node) in terms of solve(node.left/right)
//   • BFS (queue):     process level by level using an array as a queue
// =============================================================


// -------------------------------------------------------------
// Q1 — MAX DEPTH  ✅ WORKED EXAMPLE (study this recursion shape)
//
// Return the max depth (number of nodes on the longest root→leaf path).
//   maxDepth([3,9,20,null,null,15,7]) -> 3
//   maxDepth([])  -> 0
//   maxDepth([1]) -> 1
//
// The DFS recursion template:
//   1. BASE CASE: empty node contributes 0
//   2. RECURSE on left & right
//   3. COMBINE: 1 (this node) + the deeper of the two children
// -------------------------------------------------------------
function maxDepth(root) {

  if (root === null) return 0;                  // base case
  const left = maxDepth(root.left);             // recurse
  const right = maxDepth(root.right);
  return 1 + Math.max(left, right);             // combine
}


// -------------------------------------------------------------
// Q2 — INVERT BINARY TREE  (mirror it left↔right)
//
//   invert([4,2,7,1,3,6,9]) -> [4,7,2,9,6,3,1]
//   invert([2,1,3])         -> [2,3,1]
//   invert([])              -> null
//
// Hint: same DFS shape as Q1. At each node, SWAP its left and right
// children, then recurse into both. Return the node.
// -------------------------------------------------------------
function invertTree(root) {

   if(root === null) return null;

   const left  = invertTree(root.left)

   const right  = invertTree(root.right)

   root.left = right;

   root.right = left;

   return root;

}


// -------------------------------------------------------------
// Q3 — LEVEL ORDER TRAVERSAL  (BFS — return an array per level)
//
//   levelOrder([3,9,20,null,null,15,7]) -> [[3],[9,20],[15,7]]
//   levelOrder([])  -> []
//   levelOrder([1]) -> [[1]]
//
// Hint: use a QUEUE (array). Start with [root]. While the queue has
// nodes, record the CURRENT level size, pop exactly that many, push
// their children for the next level. This is THE BFS template.
// -------------------------------------------------------------
function levelOrder(root) {
  if (root === null) return [];      // empty tree → no levels

  const result = [];                 // the final answer: array of levels
  const queue = [root];              // nodes waiting to be processed (FIFO)

  while (queue.length > 0) {
    const levelSize = queue.length;  // 🔑 snapshot THIS level's node count
    const level = [];                // values for the current level

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();    // take from the FRONT (FIFO order)
      level.push(node.val);          // collect its value (.val, not .value!)

      // add this node's children for the NEXT level (left before right)
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);              // this whole level is done
  }

  return result;
}


// -------------------------------------------------------------
// Q4 — SAME TREE  (compare two trees for identical structure + values)
//
//   isSameTree([1,2,3], [1,2,3]) -> true
//   isSameTree([1,2],   [1,null,2]) -> false
//   isSameTree([1,2,1], [1,1,2]) -> false
//
// Hint: recurse on BOTH trees together. Base cases: both null -> true;
// one null (not both) -> false; values differ -> false. Otherwise
// recurse left-with-left AND right-with-right.
// -------------------------------------------------------------
function isSameTree(p, q) {

  if (p === null && q === null) return true;   // both empty → identical

  if (p === null || q === null) return false;  // only ONE empty → different shape

  if (p.val !== q.val) return false;           // values differ → not same

  // both exist and values match → check children pairwise
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}


// -------------------------------------------------------------
// Q5 — DIAMETER  (STRETCH — classic Amazon question)
//
// Longest path between ANY two nodes, measured in EDGES. The path may
// or may not pass through the root.
//   diameter([1,2,3,4,5]) -> 3   (4→2→1→3)
//   diameter([1,2])       -> 1
//   diameter([1])         -> 0
//   diameter([])          -> 0
//
// Hint (the trick): write a helper height(node) that returns the
// height, but ALSO updates an outer `best` variable with
// leftHeight + rightHeight at each node (the path through that node).
// Return `best` at the end.
// -------------------------------------------------------------
function diameter(root) {
  let best = 0;                              // longest path seen so far (in edges)

  // helper returns HEIGHT, but also updates `best` as a side effect
  function height(node) {
    if (node === null) return 0;             // base: empty has height 0
    const left = height(node.left);          // height of left subtree
    const right = height(node.right);        // height of right subtree

    best = Math.max(best, left + right);     // path THROUGH this node = left + right edges
    return 1 + Math.max(left, right);        // this subtree's height (like maxDepth)
  }

  height(root);
  
  return best;
}


// =============================================================
// TEST RUNNER — don't edit.
// =============================================================
function toTree(arr) {            // LeetCode level-order array (with nulls) -> tree
  if (!arr.length || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const q = [root];
  let i = 1;
  while (i < arr.length) {
    const node = q.shift();
    if (i < arr.length) { if (arr[i] !== null) { node.left = { val: arr[i], left: null, right: null }; q.push(node.left); } i++; }
    if (i < arr.length) { if (arr[i] !== null) { node.right = { val: arr[i], left: null, right: null }; q.push(node.right); } i++; }
  }
  return root;
}
function serialize(root) {        // tree -> level-order array (trailing nulls trimmed)
  if (!root) return [];
  const out = [], q = [root];
  while (q.length) {
    const n = q.shift();
    if (n) { out.push(n.val); q.push(n.left); q.push(n.right); }
    else out.push(null);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`);
}

check("Q1 [3,9,20,..]", maxDepth(toTree([3,9,20,null,null,15,7])), 3);
check("Q1 empty",       maxDepth(toTree([])), 0);
check("Q1 single",      maxDepth(toTree([1])), 1);

check("Q2 invert big",  serialize(invertTree(toTree([4,2,7,1,3,6,9]))), [4,7,2,9,6,3,1]);
check("Q2 invert small",serialize(invertTree(toTree([2,1,3]))), [2,3,1]);
check("Q2 invert empty", invertTree(toTree([])), null);

check("Q3 levels",      levelOrder(toTree([3,9,20,null,null,15,7])), [[3],[9,20],[15,7]]);
check("Q3 empty",       levelOrder(toTree([])), []);
check("Q3 single",      levelOrder(toTree([1])), [[1]]);

check("Q4 same",        isSameTree(toTree([1,2,3]), toTree([1,2,3])), true);
check("Q4 shape diff",  isSameTree(toTree([1,2]), toTree([1,null,2])), false);
check("Q4 value diff",  isSameTree(toTree([1,2,1]), toTree([1,1,2])), false);

check("Q5 diameter 3",  diameter(toTree([1,2,3,4,5])), 3);
check("Q5 diameter 1",  diameter(toTree([1,2])), 1);
check("Q5 single",      diameter(toTree([1])), 0);
check("Q5 empty",       diameter(toTree([])), 0);
