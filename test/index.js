var assert = require('../');
var execFile = require('child_process').execFile;

assert('truthy, not a description');
assert.equal('auto description', 'auto description');
assert(assert, 'assert exists');
assert(assert.equal, 'assert.equal exists');
assert.equal(typeof assert.strictEqual, 'function',
             'assert.strictEqual is a function');
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

exec('./test-bad-tests.js', {}, assertBad);
exec('../', {}, assertNoTests);
exec('../example', {}, tapsertExample);
exec('../tap-example', {}, tapExample);
exec('../example', {env: {ASSERT: 'assert'}}, assertExample);
exec('./assert.fail.js', {}, assertFail);

const original = require('assert');
const expected = require('../');
assert.equal(original.length, expected.length, 'assert() arity unchanged');
for (var a in original) {
  assert.equal(
    original[a].length, expected[a].length, `assert.${a}() arity unchanged`
  );
}

function exec(path, opts, callback) {
  execFile(process.execPath, [require.resolve(path)], opts, callback);
}

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

function tapsertExample(err, stdout, stderr) {
  assertHeader(err, stdout, stderr);
  assert(err, 'example fails and exits with non-zero code');
  assert.equal(stderr, '', 'example does not write to stderr');
  assert(/^1\.\.8$/m.test(stdout), 'example has TAP plan');
  assert(/^# tests 8$/m.test(stdout), 'example has 8 tests');
  assert(/^# pass  7$/m.test(stdout), 'example has 7 passing tests');
  assert(/^# fail  1$/m.test(stdout), 'example has 1 failing test');
}

function assertExample(err, stdout, stderr) {
  assert(err, 'failure results in non-zero exit');
  assert.equal(stdout, '', 'prints nothing to stdout');
  assert(/^AssertionError.*: really want false to be true$/m.test(stderr),
         'first failed assertion throws an exception');
  assert(/^\s+at .+example\.js:\d+:\d+\)$/m.test(stderr),
         'assertion exception includes regular stacktrace');
}

function tapExample(err, stdout, stderr) {
  assertHeader(err, stdout, stderr);
  assert(err, 'tap-example fails and exits with non-zero code');
  assert.equal(stderr, '', 'tap-example does not write to stderr');
  assert(/^1\.\.8$/m.test(stdout), 'tap-example has TAP plan');
  assert(/^# tests 8$/m.test(stdout), 'tap-example has 8 tests');
  assert(/^# pass  7$/m.test(stdout), 'tap-example has 7 passing tests');
  assert(/^# fail  1$/m.test(stdout), 'tap-example has 1 failing test');
}

function assertHeader(err, stdout, stderr) {
  assert(/^\s*TAP version 13/.test(stdout),
         'TAP version header is the first non-whitespace output');
}

function assertFail(err, stdout, stderr) {
  assertHeader(err, stdout, stderr);
  assert(err, 'failing file exits with an error');
  assert.equal(stderr, '', 'assert.fail does not write to stderr');
  assert(/actual: "actual"$/m.test(stdout), 'includes "actual" value');
  assert(/expected: "expected"$/m.test(stdout), 'includes "expected" value');
  assert(/operator: "assert.fail"$/m.test(stdout), 'includes "operator"');
  assert(/message: Should never pass/.test(stdout), 'includes "message"');
  assert(/^# tests 1$/m.test(stdout), 'assert.fail has 1 tests');
  assert(/^# fail  1$/m.test(stdout), 'assert.fail has 1 failing test');
}
