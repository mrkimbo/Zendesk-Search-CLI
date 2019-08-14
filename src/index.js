const { clearScreen } = require('./util');
const dataService = require('./service/data-service');
const engine = require('./search');
const { performSearch } = require('./app');
require('./config/errors')();

// Main process
async function main() {
  clearScreen();
  const rawData = await dataService.load();
  await engine.init(rawData);
  await performSearch();
}

main();
