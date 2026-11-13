const test = require('node:test');
const assert = require('node:assert');
const { lerOrigens } = require('../src/config');

test('FRONTEND_URL aceita várias origens separadas por vírgula', () => {
  assert.deepStrictEqual(
    lerOrigens('https://recicla-pe.vercel.app/, http://localhost:5173'),
    ['https://recicla-pe.vercel.app', 'http://localhost:5173'],
  );
  assert.deepStrictEqual(lerOrigens(''), []);
});
