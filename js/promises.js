// ============================================================
//  JAVASCRIPT PROMISES & async/await  (run: node js/promises.js)
// ------------------------------------------------------------
//  A Promise = an object representing the eventual result of an
//  async operation. It connects directly to your eventloop.js:
//  promise callbacks run on the MICROTASK queue (priority over
//  setTimeout's macrotask queue).
//
//  3 STATES:
//    pending    → initial, not done yet
//    fulfilled  → completed successfully (resolve)
//    rejected   → failed (reject)
//  Once settled (fulfilled/rejected), a promise NEVER changes again.
// ============================================================


// helper: a fake async task that resolves/rejects after `ms`
function delay(ms, value, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      shouldFail ? reject(new Error(`failed: ${value}`)) : resolve(value);
    }, ms);
  });
}


async function main() {
  // ==========================================================
  //  1) CREATING & CONSUMING a promise
  //     new Promise((resolve, reject) => {...})
  //     consume with .then() / .catch() / .finally()
  // ==========================================================
  console.log("1) basic promise:");
  await new Promise((resolve, reject) => {
    const ok = true;
    if (ok) resolve("✅ data loaded");
    else reject(new Error("❌ failed"));
  })
    .then((result) => console.log("   then:", result))   // runs on fulfill
    .catch((err) => console.log("   catch:", err.message)) // runs on reject
    .finally(() => console.log("   finally: always runs")); // cleanup, always


  // ==========================================================
  //  2) WHY PROMISES EXIST — escaping "callback hell"
  //     Promises let you CHAIN: each .then returns a new promise.
  //     Returning a value passes it to the next .then.
  // ==========================================================
  console.log("\n2) chaining (flat, not nested):");
  await delay(50, 1)
    .then((n) => { console.log("   step", n); return delay(50, 2); })
    .then((n) => { console.log("   step", n); return delay(50, 3); })
    .then((n) => console.log("   step", n));
  // ⬆️ compare to callback hell: doThis(() => doThat(() => doOther(...)))


  // ==========================================================
  //  3) async / await — SUGAR over promises (cleaner chaining)
  //     `await` pauses until the promise settles; reads top-to-bottom.
  //     Wrap in try/catch for errors (replaces .catch).
  // ==========================================================
  console.log("\n3) async/await:");
  try {
    const a = await delay(50, "first");
    console.log("   got:", a);
    const b = await delay(50, "second");
    console.log("   got:", b);
    await delay(30, "boom", true); // this one rejects
  } catch (err) {
    console.log("   caught:", err.message); // try/catch catches the rejection
  }


  // ==========================================================
  //  4) PROMISE COMBINATORS — running multiple in parallel
  // ==========================================================
  console.log("\n4) combinators:");

  // all → waits for ALL; rejects fast if ANY rejects
  const all = await Promise.all([delay(30, "x"), delay(50, "y"), delay(20, "z")]);
  console.log("   all:", all); // ['x','y','z'] (order preserved, not by speed)

  // race → settles with the FIRST to finish (win or fail)
  const race = await Promise.race([delay(50, "slow"), delay(10, "fast")]);
  console.log("   race:", race); // 'fast'

  // allSettled → waits for all, never rejects; reports each outcome
  const settled = await Promise.allSettled([delay(20, "ok"), delay(20, "bad", true)]);
  console.log("   allSettled:", settled.map((r) => r.status)); // ['fulfilled','rejected']

  // any → first FULFILLED (ignores rejections unless all fail)
  const any = await Promise.any([delay(30, "fail1", true), delay(40, "win")]);
  console.log("   any:", any); // 'win'


  // ==========================================================
  //  5) ⚡ THE EVENT LOOP CONNECTION (your eventloop.js!)
  //     Microtask queue (promises) has PRIORITY over the
  //     macrotask queue (setTimeout). So promise callbacks run
  //     BEFORE a setTimeout(…, 0), even though both are "async".
  // ==========================================================
  console.log("\n5) microtask vs macrotask ordering:");
  console.log("   A — sync (runs now)");
  setTimeout(() => console.log("   D — setTimeout (MACROtask, last)"), 0);
  Promise.resolve().then(() => console.log("   C — promise (MICROtask, before setTimeout)"));
  console.log("   B — sync (runs now)");
  // Expected order: A, B, C, D
  //   sync code first (A, B) → microtasks drained (C) → macrotasks (D)
}

main();

// ============================================================
//  🧠 INTERVIEW SUMMARY:
//   • Promise = object for a future value; states: pending →
//     fulfilled / rejected (settles once, immutably)
//   • .then (success) / .catch (error) / .finally (always)
//   • Chaining .then avoids callback hell; each returns a new promise
//   • async/await = sugar over promises; await pauses; try/catch
//     handles rejections
//   • Promise.all (all, fail-fast) / race (first settled) /
//     allSettled (all outcomes) / any (first success)
//   • Promise callbacks = MICROTASKS → run before setTimeout
//     (macrotask). Order: sync → microtasks → macrotasks
// ============================================================
