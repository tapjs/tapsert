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
  assertHeader(err, stdout, stderr);
  assert(err, 'bad file exits with an error');
  assert.notEqual(stderr, '', 'tapsert does not clear stderr');
  assert(/Premature exit with code \d/.test(stdout), 'exits prematurely');
  assert(/# tests 0/.test(stdout),
         'notices that no asserions were run');
}

function assertNoTests(err, stdout, stderr) {
  assertHeader(err, stdout, stderr);
  assert(err, 'no assertions run is considered a failure');
  assert.equal(stderr, '', 'tapsert does not write to stderr');
  assert(!/Premature exit with code/.test(stdout),
         'does not exit prematurely');
  assert(/# tests 0/.test(stdout), 'says no assertions were run');
}

function assertHeader(err, stdout, stderr) {
  assert(/^[\s]*TAP version 13/.test(stdout),
         'TAP version header is the first non-whitespace output');
}
