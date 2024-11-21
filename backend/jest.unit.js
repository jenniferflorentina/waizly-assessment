// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharedConfig = require('./jest.config');

module.exports = {
  ...sharedConfig,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.unit.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testTimeout: 20000,
};
