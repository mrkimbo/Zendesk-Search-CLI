const inquirer = require('inquirer');
const input = require('./config/input');
const engine = require('./search');
const dataService = require('./service/data-service');
const { clearScreen } = require('./util');
const ui = require('./ui');
require('./config/errors')();

async function showResults(query, results) {
  if (!results.length) {
    ui.displayEmptyResults(query);
    return;
  }

  let selectedResult;
  if (results.length === 1) {
    selectedResult = results[0];
  } else {
    const selectionId = await ui.displayResultsList(query, results);
    selectedResult = results.find(({ _id }) => _id.toString() === selectionId);
  }

  // Show result and ask user whether to display associated data or not
  const { showAssociated } = await ui.displaySingleResult(selectedResult);

  if (showAssociated) {
    const associatedData = await engine.getAssociatedData(query.scope, selectedResult);
    ui.displayAssociatedData(associatedData);
  }
}

async function performSearch() {
  const query = await ui.gatherInput();
  const results = await engine.search(query);
  await showResults(query, results);

  const { restart } = await inquirer.prompt(input.restart);
  if (restart) {
    await performSearch();
  }
}

// Main process
async function main() {
  clearScreen();
  const rawData = await dataService.load();
  await engine.init(rawData);
  await performSearch();
}

main();
