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
assert.doesNotThrow(function() {
  assert.throws(function() {
    assert.ifError(Error('expected!'));
  }, /expected/, 'assert.ifError is supported');
}, 'quite weird');
