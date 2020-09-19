const { findFreeLiId } = require('./script')

// Making an example test, just to make sure jest testing works
test('Able to find a free nubmer?', () => {
  expect(findFreeLiId()).not.toBeNaN()
})