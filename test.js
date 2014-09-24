var assert = require('./');
var execFile = require('child_process').execFile;

assert(assert, 'assert exists');
assert(assert.equal, 'assert.equal exists');
assert.equal(typeof assert.strictEqual, 'function',
             'assert.strictEqual is a function');
assert.doesNotThrow(function() {
  assert.throws(function() {
    throw Error('expected!');
  }, /expected/, 'supports assert.throws');
}, 'nested asserts are weird.');

execFile(process.execPath, ['.'], {}, assertNoTests);

function assertNoTests(err, stdout, stderr) {
  assert(err, 'no assertions run is considered a failure');
}
