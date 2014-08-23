tapsert
=======

Not-so-drop-in assert replacement for node that produces TAP output instead of
throwing exceptions. This lets you write super-minimal tests without requring
a test runner to get output.

## Usage

Use tapsert the same as you would use assert if you don't use a test runner.

### Tests

test.js:
```js
var assert = require('tapsert');

assert(assert, 'assert exists');
assert(assert.equal, 'assert.equal exists');
assert.equal(typeof assert.strictEqual, 'function',
             'assert.strictEqual is a function');
assert.doesNotThrow(function() {
  assert.throws(function() {
    throw Error('expected!');
  }, /expected/, 'supports assert.throws');
}, 'nested asserts are weird.');
```

### Output

```sh
$ node test.js
TAP version 13
ok 1 - assert exists
ok 2 - assert.equal exists
ok 3 - assert.strictEqual is a function
ok 5 - supports assert.throws
ok 4 - nested asserts are weird.
1..5
```
