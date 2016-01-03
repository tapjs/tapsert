tapsert [![Build Status](https://travis-ci.org/tapjs/tapsert.svg)](https://travis-ci.org/tapjs/tapsert)
=======

An almost-drop-in replacement for the assert module provided by Node core that
prints TAP compliant output instead of throwing `AssertionError`s.

Uses
 * drop-in replacement for `assert` if you prefer bare asserts and no test
   runner or harness but you still want TAP output (`node plain.js`)
 * drop-in replacement for `assert` if you use a TAP consuming test runner
   but don't want to use a "real" test harness (`tap plain.js`)
 * stepping-stone for migrating from `assert` to `tap`

## Usage

Use tapsert the same as you would use assert if you don't use a test runner.

### Examples

Start with the assert module from node core.
```js
var assert = require('assert');
assert.equal('actual', 'expected', 'core assert style');
```

Replace `require('assert')` with `require('tapsert')` to produce TAP output.
```js
var assert = require('tapsert');
assert.equal('actual', 'expected', 'core assert style');
```

Rename `assert` to `tap` to prepare for switching to [https://github.com/tapjs/node-tap](tap).
```js
var tap = require('tapsert');
tap.equal('actual', 'expected', 'tap assert style');
```

Replace `require('tapsert')` with `require('tap')` and you're using tap.
```js
var tap = require('tap');
tap.equal('actual', 'expected', 'tap assert style');
```

### Tests

Tests are written as simple asserts revealing full intentions.

```js
// example.js
var assert = require(process.env.ASSERT || './');

assert(assert, 'assert exists');
assert(assert.equal, 'assert.equal exists');
assert.equal(typeof assert.strictEqual, 'function',
             'assert.strictEqual is a function');
assert.ok(false, 'really want false to be true');
assert.doesNotThrow(function() {
  assert.throws(function() {
    throw Error('expected!');
  }, /expected/, 'supports assert.throws');
}, 'nested asserts are weird.');
```

### Output

Output shows the result of each assertion, even if there are failures:

```sh
$ node test.js
TAP version 13
ok 1 - assert exists
ok 2 - assert.equal exists
ok 3 - assert.strictEqual is a function
not ok 4 - really want false to be true
# actual: false
# expected: true
# operator: "=="
# message: really want false to be true
# AssertionError: really want false to be true
#     at Function.tapifiedAssert [as ok] (/Users/ryan/work/tapsert/index.js:25:14)
#     at Object.<anonymous> (/Users/ryan/work/tapsert/example.js:7:8)
#     at Module._compile (module.js:456:26)
#     at Object.Module._extensions..js (module.js:474:10)
#     at Module.load (module.js:356:32)
#     at Function.Module._load (module.js:312:12)
#     at Function.Module.runMain (module.js:497:10)
#     at startup (node.js:119:16)
#     at node.js:906:3
ok 6 - supports assert.throws
ok 5 - nested asserts are weird.

1..6
# tests 6
# pass  5
# fail  1

$ echo $?
1
```

The same tests run with assert from node core (output captured from stderr):
```sh
$ ASSERT=assert node example.js

assert.js:92
  throw new assert.AssertionError({
        ^
AssertionError: really want false to be true
    at Object.<anonymous> (/Users/ryan/work/tapsert/example.js:7:8)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
    at startup (node.js:119:16)
    at node.js:906:3

$ echo $?
8
```

---
&copy; 2014 Ryan Graham
