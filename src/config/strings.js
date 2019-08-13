const chalk = require('chalk');
const { PAGE_SIZE } = require('./constants');

const pluralise = (word, count) => `${word}${count > 1 ? 's' : ''}`;

const errors = {
  FATAL_ERROR: chalk.red(
    'Zendesk Search encountered an issue and was forced to quit.\n' +
      'Please restart this application to search again'
  ),
  NO_SEARCHABLE_FIELDS: chalk.red('Sorry - no searchable fields exist for that selection')
};

const messages = {
  EXIT: chalk.green('Zendesk Search\nUse `npm start` or `./search.sh` to restart the app'),
  LOAD_START: chalk.yellow('Loading raw data files..'),
  PARSE_START: chalk.yellow('Parsing raw data files..'),
  SEARCH_START: chalk.yellow('Searching...'),
  NO_RESULTS: chalk.grey('No matches found\n'),
  APP_HEADER:
    chalk.green('------------------\n') +
    chalk.bold.green('  Zendesk Search\n') +
    chalk.green('------------------\n'),
  RESULTS_HEADER: (idx, pages) => {
    const totalResults = (pages.length - 1) * PAGE_SIZE + pages[idx].length;
    return chalk.grey(
      `${totalResults} ${pluralise('result', totalResults)} found (Page ${idx + 1} of ${
        pages.length
      })`
    );
  },
  SEARCH_QUERY: ({ scope, field, query }) =>
    chalk.yellow(
      `Searching [${chalk.bold(field)} = '${chalk.bold(query)}'] in ${chalk.bold(scope)}`
    )
};

module.exports = {
  messages,
  errors
};
