module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/search/basic-engine/index.js', '!src/config/*.js'],
  coverageReporters: ['html', 'text', 'text-summary'],
  testEnvironment: 'node'
};
