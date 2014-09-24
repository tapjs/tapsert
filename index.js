var assert = require('assert');
var fmt = require('util').format;

var tapsert = module.exports = tapifyAssert(assert);

for (var a in assert) {
  tapsert[a] = tapifyAssert(assert[a]);
}

var assertions = 0;
var failures = 0;

function tapifyAssert(assert) {
  return tapifiedAssert;

  function tapifiedAssert() {
    var desc = (arguments.length === assert.length
                ? arguments[arguments.length-1]
                : '');
    maybeHeader();
    var n = assertions += 1;
    try {
      assert.apply(null, arguments);
      console.log('ok %d - %s', n, desc);
    } catch (e) {
      failures += 1;
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

process.on('exit', function(code) {
  maybeHeader();
  console.log('1..%d', assertions);
  process.exit(failures);
});
