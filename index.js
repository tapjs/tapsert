var assert = require('assert');

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
  }
}

process.on('exit', function() {
  console.log('1..%d', assertions);
  process.exit(failures);
});
