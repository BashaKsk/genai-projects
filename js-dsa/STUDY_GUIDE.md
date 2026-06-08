# Amazon Support Engineer — DSA Study Guide

> Target role: Support Engineer, ~4 YOE. JavaScript solutions.
> Format: each problem has **Prompt → Approach → Solution → Complexity → What to say out loud**.
> Order = roughly the order to attempt them. Solve first, then check.

---

## How to use this doc

1. Read the prompt. **Don't read the solution.**
2. Write your solution in `dsa.js` or a scratch file.
3. Run a few cases mentally + with `console.log`.
4. Then compare with the solution and "what to say out loud" notes.
5. Re-attempt anything you fumbled 2–3 days later.

**The interviewer cares about three things, in order:**
1. Can you talk through your approach *before* coding?
2. Does it work + handle edge cases?
3. Is the complexity reasonable, and do you know what it is?

---

# Tier 1 — Must Do

## 1. Valid Parentheses ✅ (done)

Already solved. Key takeaway: replace `Object.values(pairs).includes(char)` with direct lookup for true O(n).

---

## 2. Min Stack

**Prompt:** Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element in **O(1)** time.

**Approach:** Keep a second stack that tracks the minimum at each level. Push to it only when the new value is `<=` current min. Pop from it when the popped value equals current min.

```js
class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(val) {
        this.stack.push(val);
        if (this.minStack.length === 0 || val <= this.minStack.at(-1)) {
            this.minStack.push(val);
        }
    }
    pop() {
        const popped = this.stack.pop();
        if (popped === this.minStack.at(-1)) this.minStack.pop();
        return popped;
    }
    top() { return this.stack.at(-1); }
    getMin() { return this.minStack.at(-1); }
}
```

**Complexity:** All ops O(1). Space O(n).

**Say out loud:** "The trick is `<=` not `<` when pushing to minStack — otherwise duplicates break pop."

---

## 3. Daily Temperatures

**Prompt:** Given an array `temps`, return an array `answer` where `answer[i]` is the number of days until a warmer temperature. If none, put 0.

Example: `[73,74,75,71,69,72,76,73]` → `[1,1,4,2,1,1,0,0]`

**Approach:** Monotonic decreasing stack of **indices**. When current temp is warmer than stack top, pop and record the index gap.

```js
function dailyTemperatures(temps) {
    const result = new Array(temps.length).fill(0);
    const stack = []; // stores indices
    for (let i = 0; i < temps.length; i++) {
        while (stack.length && temps[i] > temps[stack.at(-1)]) {
            const j = stack.pop();
            result[j] = i - j;
        }
        stack.push(i);
    }
    return result;
}
```

**Complexity:** Time O(n), Space O(n).

**Say out loud:** "Each index is pushed and popped at most once, so total work is linear despite the nested loop."

---

## 4. Decode String ⭐ (Amazon favorite)

**Prompt:** Given `"3[a2[c]]"`, return `"accaccacc"`. The encoding is `k[encoded]` repeats `encoded` k times.

**Approach:** Two stacks — one for repeat counts, one for partial strings. When you hit `[`, push current state. When you hit `]`, pop and combine.

```js
function decodeString(s) {
    const countStack = [];
    const stringStack = [];
    let current = '';
    let k = 0;
    for (const char of s) {
        if (char >= '0' && char <= '9') {
            k = k * 10 + Number(char);
        } else if (char === '[') {
            countStack.push(k);
            stringStack.push(current);
            k = 0;
            current = '';
        } else if (char === ']') {
            const repeat = countStack.pop();
            const prev = stringStack.pop();
            current = prev + current.repeat(repeat);
        } else {
            current += char;
        }
    }
    return current;
}
```

**Complexity:** Time O(maxK · n), Space O(n).

**Say out loud:** "Numbers can be multi-digit (`12[a]`), so I accumulate `k = k*10 + digit`."

---

## 5. Two Sum

**Prompt:** Given `nums` and `target`, return indices of two numbers that add to `target`.

```js
function twoSum(nums, target) {
    const seen = new Map(); // value -> index
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement), i];
        seen.set(nums[i], i);
    }
    return [];
}
```

**Complexity:** Time O(n), Space O(n).

**Say out loud:** "Brute force is O(n²). Hashmap trades space for time."

---

## 6. Group Anagrams

**Prompt:** Group strings that are anagrams of each other.
Example: `["eat","tea","tan","ate","nat","bat"]` → `[["eat","tea","ate"],["tan","nat"],["bat"]]`

**Approach:** Hash each word by its sorted form (or character-count signature).

```js
function groupAnagrams(strs) {
    const groups = new Map();
    for (const s of strs) {
        const key = s.split('').sort().join('');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
    }
    return [...groups.values()];
}
```

**Complexity:** Time O(n · k log k) where k = avg string length. Can be O(n·k) using count-array key.

**Say out loud:** "If strings can be very long but only lowercase, I'd use a 26-length count array as the key — that's O(n·k) instead of O(n·k log k)."

---

## 7. Longest Substring Without Repeating Characters ⭐

**Prompt:** Given a string, return the length of the longest substring with all distinct characters.
Example: `"abcabcbb"` → `3` (`"abc"`).

**Approach:** Sliding window with a Set. Expand right; when a duplicate appears, shrink left.

```js
function lengthOfLongestSubstring(s) {
    const seen = new Set();
    let left = 0;
    let max = 0;
    for (let right = 0; right < s.length; right++) {
        while (seen.has(s[right])) {
            seen.delete(s[left]);
            left++;
        }
        seen.add(s[right]);
        max = Math.max(max, right - left + 1);
    }
    return max;
}
```

**Complexity:** Time O(n), Space O(min(n, charset)).

**Say out loud:** "Each character is added and removed from the set at most once → O(n)."

---

## 8. Valid Palindrome

**Prompt:** Determine if a string is a palindrome considering only alphanumeric characters, ignoring case.

```js
function isPalindrome(s) {
    let l = 0, r = s.length - 1;
    const isAlnum = c => /[a-z0-9]/i.test(c);
    while (l < r) {
        while (l < r && !isAlnum(s[l])) l++;
        while (l < r && !isAlnum(s[r])) r--;
        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
        l++; r--;
    }
    return true;
}
```

**Complexity:** Time O(n), Space O(1).

**Variant — Valid Palindrome II:** allow deleting at most one character. When `s[l] !== s[r]`, try skipping either one and check if the remaining slice is a palindrome.

---

## 9. 3Sum

**Prompt:** Find all unique triplets `(a, b, c)` in `nums` such that `a + b + c == 0`.

**Approach:** Sort. Fix one element, two-pointer the rest. Skip duplicates.

```js
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue; // skip dup
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const sum = nums[i] + nums[l] + nums[r];
            if (sum === 0) {
                result.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return result;
}
```

**Complexity:** Time O(n²), Space O(1) extra (ignoring output).

**Say out loud:** "Sorting is O(n log n), but the n² dominates. The hardest part is deduping — both at the outer loop and after finding a match."

---

## 10. Container With Most Water

**Prompt:** Given heights, find two lines that form a container holding the most water.

```js
function maxArea(height) {
    let l = 0, r = height.length - 1;
    let max = 0;
    while (l < r) {
        const area = Math.min(height[l], height[r]) * (r - l);
        max = Math.max(max, area);
        if (height[l] < height[r]) l++;
        else r--;
    }
    return max;
}
```

**Complexity:** Time O(n), Space O(1).

**Say out loud:** "Always move the shorter side — moving the taller side can never increase the area (width shrinks, height capped by the shorter)."

---

# Tier 2 — Strong Likelihood

## 11. Reverse Linked List

```js
function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

**Complexity:** Time O(n), Space O(1).

Recursive version:
```js
function reverseListRecursive(head) {
    if (!head || !head.next) return head;
    const newHead = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}
```

---

## 12. Merge Two Sorted Lists

```js
function mergeTwoLists(l1, l2) {
    const dummy = { next: null };
    let tail = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else { tail.next = l2; l2 = l2.next; }
        tail = tail.next;
    }
    tail.next = l1 || l2;
    return dummy.next;
}
```

**Say out loud:** "Dummy node avoids special-casing the head."

---

## 13. Linked List Cycle (Floyd's)

```js
function hasCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}
```

**Complexity:** Time O(n), Space O(1).

**Say out loud:** "If there's a cycle, fast laps slow — they must meet. If no cycle, fast hits null."

---

## 14. LRU Cache ⭐⭐ (Amazon classic)

**Prompt:** Design a cache with `get(key)` and `put(key, value)` in **O(1)**. When capacity is exceeded, evict the least recently used item.

**Approach:** Hashmap (key → node) + doubly-linked-list (ordered by recency). Most-recent at head, LRU at tail.

```js
class LRUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.map = new Map();
        this.head = { key: null, val: null }; // sentinel
        this.tail = { key: null, val: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    _addToFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }
    get(key) {
        if (!this.map.has(key)) return -1;
        const node = this.map.get(key);
        this._remove(node);
        this._addToFront(node);
        return node.val;
    }
    put(key, val) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            node.val = val;
            this._remove(node);
            this._addToFront(node);
            return;
        }
        if (this.map.size === this.cap) {
            const lru = this.tail.prev;
            this._remove(lru);
            this.map.delete(lru.key);
        }
        const node = { key, val };
        this._addToFront(node);
        this.map.set(key, node);
    }
}
```

**Complexity:** All ops O(1). Space O(capacity).

**Say out loud:**
- "JS `Map` preserves insertion order, so you *can* cheat with just a Map — but interviewers usually want the explicit DLL implementation to show you understand it."
- "Sentinel head/tail nodes mean I never have to null-check `prev`/`next`."

---

## 15. Number of Islands ⭐

**Prompt:** Count islands in a grid of `'1'` (land) and `'0'` (water). Connected horizontally/vertically.

```js
function numIslands(grid) {
    if (!grid.length) return 0;
    const rows = grid.length, cols = grid[0].length;
    let count = 0;
    const dfs = (r, c) => {
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
        grid[r][c] = '0'; // mark visited
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    };
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                count++;
                dfs(r, c);
            }
        }
    }
    return count;
}
```

**Complexity:** Time O(rows · cols), Space O(rows · cols) worst case (recursion stack).

**Say out loud:** "I'm mutating the input to mark visited. If that's not allowed, I'd use a separate `visited` set."

---

## 16. Course Schedule (topological sort)

**Prompt:** Given `numCourses` and `prerequisites` (pairs), can you finish all courses? (i.e., no cycle in the dependency graph)

**Approach:** Kahn's algorithm — BFS using in-degrees.

```js
function canFinish(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);
    for (const [course, pre] of prerequisites) {
        graph[pre].push(course);
        inDegree[course]++;
    }
    const queue = [];
    for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);
    let taken = 0;
    while (queue.length) {
        const c = queue.shift();
        taken++;
        for (const next of graph[c]) {
            if (--inDegree[next] === 0) queue.push(next);
        }
    }
    return taken === numCourses;
}
```

**Complexity:** Time O(V + E), Space O(V + E).

**Say out loud:** "If we can't process all nodes, there's a cycle."

---

## 17. Level Order Traversal (BFS)

```js
function levelOrder(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length) {
        const level = [];
        const size = queue.length;
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
}
```

**Note:** `queue.shift()` is O(n). For real interviews mention you'd use a proper queue or an index pointer if perf matters.

---

# Tier 3 — Good to Have

## 18. Top K Frequent Elements

**Approach:** Bucket sort by frequency (faster than min-heap for this).

```js
function topKFrequent(nums, k) {
    const freq = new Map();
    for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [num, count] of freq) buckets[count].push(num);
    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        for (const n of buckets[i]) {
            result.push(n);
            if (result.length === k) break;
        }
    }
    return result;
}
```

**Complexity:** Time O(n), Space O(n). Better than the standard O(n log k) heap approach.

---

## 19. Merge Intervals

```js
function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = result[result.length - 1];
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            result.push(intervals[i]);
        }
    }
    return result;
}
```

**Complexity:** Time O(n log n) due to sort, Space O(n) for result.

---

## 20. Search in Rotated Sorted Array

```js
function search(nums, target) {
    let l = 0, r = nums.length - 1;
    while (l <= r) {
        const mid = (l + r) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[l] <= nums[mid]) {
            // left half sorted
            if (target >= nums[l] && target < nums[mid]) r = mid - 1;
            else l = mid + 1;
        } else {
            // right half sorted
            if (target > nums[mid] && target <= nums[r]) l = mid + 1;
            else r = mid - 1;
        }
    }
    return -1;
}
```

**Complexity:** Time O(log n).

**Say out loud:** "At every step, at least one half is sorted — figure out which, then decide if target is in that sorted half."

---

# Non-DSA Topics (don't skip these)

## SQL — practice these patterns

- Second highest salary (`LIMIT 1 OFFSET 1` or correlated subquery)
- Nth highest salary (window function `DENSE_RANK()`)
- Duplicate emails (`GROUP BY ... HAVING COUNT(*) > 1`)
- Customers who never order (LEFT JOIN with NULL check, or `NOT IN`/`NOT EXISTS`)
- Users active 3+ consecutive days (window functions + date arithmetic)
- Department top 3 salaries per department (window function with `RANK() OVER (PARTITION BY ...)`)

## Linux / debugging

- `grep -i`, `grep -r`, `grep -v`, `grep -A 3 -B 3`
- `awk '{print $2}'`, `awk -F',' '{...}'`
- `top`, `htop`, `ps aux | grep`
- `netstat -tulpn`, `ss -tulpn`, `lsof -i :8080`
- `df -h`, `du -sh *`, `du -sh * | sort -h`
- `tail -f`, `tail -n 100 log | grep ERROR`
- Signals: `SIGTERM` (15) vs `SIGKILL` (9), `SIGHUP` (1)
- Zombies, orphans, defunct processes
- File descriptors, `ulimit -n`

## Networking

- TCP vs UDP — when to use each
- Three-way handshake (SYN → SYN-ACK → ACK)
- "What happens when you type google.com" — full walkthrough
- DNS, TTL, A vs CNAME vs MX
- HTTP status codes (esp. 4xx vs 5xx — who's at fault)
- Latency vs throughput vs bandwidth
- Load balancing, sticky sessions
- HTTPS / TLS handshake (high level)

## Debugging scenarios (practice out loud)

- "The service started returning 500s at 3am — how do you investigate?"
- "Disk is at 95%, what's your process?"
- "A customer says the API is slow but our dashboards look fine — what now?"
- "Database CPU is pinned — walk me through diagnosis."
- "Deploy went out, error rate spiked — first three things you do?"

**Framework to use:** clarify → check monitoring/dashboards → check logs → check recent changes → narrow scope → form hypothesis → test → fix → write up.

## Leadership Principles — prep 5–7 STAR stories

Each story should cover 2–3 LPs. Top LPs to cover:

- **Customer Obsession** — went out of your way for a customer outcome
- **Ownership** — took on something outside your role
- **Dive Deep** — found a root cause others missed
- **Bias for Action** — made a call with incomplete info
- **Deliver Results** — shipped under constraints
- **Earn Trust** — gave or received hard feedback
- **Are Right, A Lot** — judgment call that worked out
- **Insist on the Highest Standards** — pushed back on shipping something below bar

**STAR format:** Situation → Task → Action (mostly you, "I" not "we") → Result (with numbers).

---

# Suggested schedule

**Week 1 (foundations):**
- 2 Tier-1 problems/day
- 30 min SQL daily
- Write 2 STAR stories

**Week 2 (depth):**
- 2 Tier-2 problems/day
- Linux + networking review
- Write 3 more STAR stories, polish all 5

**Week 3 (mocks):**
- Tier-3 problems
- Re-do any Tier-1 you fumbled, *without looking*
- 2 mock interviews (Pramp / friend / out-loud solo)
- 2 debugging scenario practice rounds

---

# Day-of tips

- **Talk first, code second.** Interviewer scoring weighs communication heavily.
- **Always state complexity** (time + space) without being asked.
- **Test your code by tracing through a small example** at the end.
- **For LPs: numbers, ownership ("I"), results.** Avoid "we did X" — they want to know what *you* did.
- **It's fine to ask for clarification.** Constraints (size of input, character set, can input be empty/null?) often unlock the right approach.
