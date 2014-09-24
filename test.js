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

execFile(process.execPath, ['test-bad-tests.js'], {}, assertBad);
execFile(process.execPath, ['.'], {}, assertNoTests);

function assertBad(err, stdout, stderr) {
  assert(err, 'bad file exits with an error');
  assert(/Premature exit with code \d/.test(stdout), 'exits prematurely');
}

function assertNoTests(err, stdout, stderr) {
  assert(err, 'no assertions run is considered a failure');
  assert(!/Premature exit with code/.test(stdout),
         'does not exit prematurely');
}
