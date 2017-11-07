var assert = require('assert');
var fmt = require('util').format;

var tapsert = module.exports = tapifyAssert(assert);

for (var a in assert) {
  tapsert[a] = (a === 'ifError') ? assert[a] : tapifyAssert(assert[a]);
}
tapsert.assert = tapsert

var assertions = 0;
var failures = 0;

process.on('exit', tapsert$exit);

function tapifyAssert(assert) {
  var length = Object.getOwnPropertyDescriptor(assert, 'length');
  Object.defineProperty(tapifiedAssert, 'length', length);

  return tapifiedAssert;

  function tapifiedAssert() {
    var desc = (arguments.length === assert.length
                ? arguments[arguments.length-1]
                : assert.name);
    maybeHeader();
    var n = assertions += 1;
    try {
      assert.apply(null, arguments);
      console.log('ok %d - %s', n, desc);
    } catch (e) {
      failures += 1;
      desc = (assert.name === 'fail' && arguments.length) ? e.message :  desc;
      console.log('not ok %d - %s', n, desc);
      console.log(formatAssertionError(e));
    }
  }
}

function formatAssertionError(e) {
  error = [
    fmt('actual: %j', e.actual),
    fmt('expected: %j', e.expected),
    fmt('operator: %j', e.operator),
    fmt('message: %s', e.message),
    e.stack,
  ].join('\n');
  return prefixLines('# ', error);
}

function prefixLines(prefix, text) {
  return text.split('\n')
             .map(prepend)
             .join('\n');

  function prepend(line) {
    return prefix + line;
  }
}

function maybeHeader() {
  if (assertions === 0)
    console.log('TAP version 13');
}

function tapsert$exit(code) {
  // Treat 0 assertions as a failure
  failures += 0|!assertions;

  maybeHeader();

  if (code)
    console.log('# Premature exit with code %d', code);

  console.log('\n1..%d', assertions);
  console.log('# tests %d', assertions);
  if (assertions-failures > 0)
    console.log('# pass  %d', Math.max(assertions-failures, 0));
  if (failures > 0)
    console.log('# fail  %d', failures);
  // TODO: add skip support
  // if (skipped > 0)
  //   console.log('# skip  %d', skipped);

  // only exit with non-zero if we need to and aren't already doing so
  if (!code && failures)
    process.exit(failures);
}
