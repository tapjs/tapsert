var t = require('./');

// The limited subset of node-tap's assertions that are in core
// work out of the box.

t.assert(t.assert, 't.assert exists');
t.assert(t.equal, 't.equal exists');
t.equal(typeof t.strictEqual, 'function',
             't.strictEqual is a function');
t.ok(false, 'really want false to be true');
t.doesNotThrow(function() {
  t.throws(function() {
    throw Error('expected!');
  }, /expected/, 'supports t.throws');
}, 'nested asserts are weird.');

