var assert = require('assert');

module.exports = tapsert = recordAssert(assert);

for (var a in assert) {
  tapsert[a] = recordAssert(assert[a]);
}

var assertions = 0;
var failures = 0;

function recordAssert(assert) {
  return function() {
    var desc = (arguments.length === assert.length
                ? arguments[arguments.length-1]
                : '');
    if (assertions === 0)
      console.log('TAP version 13');
    var n = assertions += 1;
    try {
      assert.apply(null, arguments);
      console.log('ok %d - %s', n, desc);
    } catch (e) {
      failures += 1;
      console.log('not ok %d - %s', n, desc)
    }
  };
}

process.on('exit', function() {
  console.log('1..%d', assertions);
  process.exit(failures);
});
