const clearConsole = require('clear');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { questions, messages } = require('./strings');
const engine = require('./search');
const fetchData = require('./fetchData');
require('./errors');

function clearScreen() {
  clearConsole();
  console.log(chalk.green('------------------'));
  console.log(chalk.bold.green('  Zendesk Search'));
  console.log(chalk.green('------------------'));
}

async function performSearch() {
  const query = await gatherInput();
  const results = await engine.search(query);
  displayResults(query, results);

  const { restart } = await inquirer.prompt(questions.restart);
  if (restart) {
    await performSearch();
  }

  // exit
  process.exit(0);
}

async function gatherInput() {
  clearScreen();
  const { scope } = await inquirer.prompt(questions.search.scope);
  const searchFields = engine.getSearchableFields(scope);
  const { field } = await inquirer.prompt(questions.search.field(searchFields));
  const { query } = await inquirer.prompt(questions.search.query);
  return { scope, field, query };
}

function displayResults(query, results) {
  clearScreen();
  console.log(messages.SEARCH_QUERY(query));

  if (!results.length) {
    console.log(messages.NO_RESULTS);
    return;
  }

  console.log(messages.RESULTS_HEADER(results.length));

  // Pagination / Prompts to show associated data?
}

async function main() {
  clearScreen();
  const rawData = await fetchData();
  await engine.init(rawData);
  await performSearch();
}

main();
