const assert = require('../');

const actual = 'actual';
const expected = 'expected';
const operator = '<=>';

assert.fail(actual, expected, 'with custom message');
assert.fail(actual, expected, 'with message and operator', operator);
assert.fail(actual, expected, undefined, operator);

(function stackStart() {
  assert.fail(actual, expected, 'with everything', operator, stackStart);
})();

(function stackStart() {
  assert.fail(actual, expected, undefined, operator, stackStart);
})();

if (process.version >= 'v8.0.0') {
  assert.fail('with message only');
  assert.fail(actual, expected);
}
