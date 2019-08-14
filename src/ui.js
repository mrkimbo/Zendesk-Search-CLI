const inquirer = require('inquirer');
const chalk = require('chalk');
const input = require('./config/input');
const { messages } = require('./config/strings');
const engine = require('./search');
const { clearScreen, paginate, capitalise } = require('./util');

const getResultItemTitle = ({ _id, name, subject }) => `${_id}: ${name || subject}`;
const isNextPageSelection = (option) => option.includes('Next Page');
const isPrevPageSelection = (option) => option.includes('Previous Page');
const getSelectionId = (option) => {
  if (!option.includes(':')) {
    return null;
  }
  return option.split(':')[0];
};

async function gatherInput() {
  clearScreen();
  const { scope } = await inquirer.prompt(input.search.scope);
  const searchFields = engine.getFields(scope);
  const { field } = await inquirer.prompt(input.search.field(searchFields));
  const { query } = await inquirer.prompt(input.search.query);
  return { scope, field, query };
}

// Display a page of results with next/prev page options
async function displayPage(query, pages, idx) {
  const currentPage = pages[idx];
  clearScreen(messages.SEARCH_QUERY(query), messages.RESULTS_HEADER(idx, pages));

  const choices = currentPage.map(getResultItemTitle);
  if (idx > 0) {
    choices.unshift('← Previous Page');
  }
  if (idx < pages.length - 1) {
    choices.push('Next Page →');
  }

  return inquirer.prompt(input.results(choices));
}

// Present user with paginated options until they select a result to view
async function displayResultsList(query, results) {
  clearScreen(messages.SEARCH_QUERY(query));
  const pages = paginate(results);
  let pageIndex = 0;
  let selectionId;

  do {
    const { selection } = await displayPage(query, pages, pageIndex);
    if (isNextPageSelection(selection)) {
      pageIndex++;
    } else if (isPrevPageSelection(selection)) {
      pageIndex--;
    }
    selectionId = getSelectionId(selection);
  } while (!selectionId);

  return selectionId;
}

// Display selected result and option to show associated data
async function displaySingleResult(result) {
  clearScreen();
  console.log(JSON.stringify(result, null, 2));

  return inquirer.prompt(input.showAssociated);
}

function displayEmptyResults(query) {
  clearScreen(messages.SEARCH_QUERY(query));
  console.log(messages.NO_RESULTS);
}

// Display associated data for given search result
function displayAssociatedData(data) {
  Object.entries(data).forEach(([key, val]) => {
    console.log(chalk.gray.bold(`\n${capitalise(key)}:`));
    val.map((str) => console.log(` - ${str}`));
  });

  console.log('\n');
}

module.exports = {
  gatherInput,
  displaySingleResult,
  displayResultsList,
  displayEmptyResults,
  displayAssociatedData
};
