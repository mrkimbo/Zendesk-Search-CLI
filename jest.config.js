module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/search/basic-engine/index.js', '!src/config/*.js'],
  coverageReporters: ['html', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testEnvironment: 'node'
};
