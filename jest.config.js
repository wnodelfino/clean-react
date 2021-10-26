module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  testeEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
