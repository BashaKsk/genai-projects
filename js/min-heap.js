// =============================================================
// Min-Heap from scratch + Top-K Frequent using it.
// Run:  node js/min-heap.js
// =============================================================

class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare; // returns <0 if a should sit ABOVE b
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0]; // the minimum (or undefined if empty)
  }

  push(val) {
    this.data.push(val);          // 1. add at the end
    this._bubbleUp(this.data.length - 1);
  }

  pop() {
    const top = this.data[0];     // the min we'll return
    const last = this.data.pop(); // remove the last element
    if (this.data.length > 0) {
      this.data[0] = last;        // move it to the root
      this._bubbleDown(0);        // and sink it to its spot
    }
    return top;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.data[i], this.data[parent]) >= 0) break; // parent is fine
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]]; // swap
      i = parent;
    }
  }

  _bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
      if (smallest === i) break;  // already in the right place
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}

// ---- quick sanity check: a min-heap pops in ascending order ----
const h = new MinHeap();
[5, 1, 8, 3, 2].forEach((x) => h.push(x));
const out = [];
while (h.size) out.push(h.pop());
console.log("heap pops ascending:", out); // [1, 2, 3, 5, 8]

// =============================================================
// Top-K Frequent using a min-heap of size k  ->  O(n + m log k)
// =============================================================
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);

  // heap holds [value, count], ordered by count ASCENDING
  // so the SMALLEST count is always on top and easy to evict.
  const heap = new MinHeap((a, b) => a[1] - b[1]);

  for (const [val, count] of freq) {
    heap.push([val, count]);
    if (heap.size > k) heap.pop(); // drop the smallest-count entry
  }
  // whatever survives is the k largest counts
  return heap.data.map(([val]) => val);
}

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [2, 1] or [1, 2]
console.log(topKFrequent([4, 4, 5, 5, 5, 6], 2)); // [4, 5] or [5, 4]
console.log(topKFrequent([7], 1));                // [7]
