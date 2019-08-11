const chalk = require('chalk');
const { pluralise } = require('./util');

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
  RESULTS_HEADER: (n) => chalk.grey(`${n} ${pluralise('result', n)} found`),
  SEARCH_QUERY: ({ scope, field, query }) =>
    chalk.yellow(
      `Searching [${chalk.bold(field)} = '${chalk.bold(query)}'] in ${chalk.bold(scope)}`
    )
};

const questions = {
  search: {
    scope: [
      {
        name: 'scope',
        type: 'list',
        message: 'What would you like to search for?',
        default: 'Organisations',
        choices: ['Organisations', 'Tickets', 'Users']
      }
    ],
    field: (choices) => [
      {
        name: 'field',
        type: 'list',
        message: 'Select field to search',
        default: 'name',
        pageSize: 15,
        choices
      }
    ],
    query: [
      {
        name: 'query',
        type: 'input',
        default: '',
        message: 'Query:'
      }
    ]
  },
  restart: [
    {
      type: 'confirm',
      name: 'restart',
      message: 'Search again? (entering N will exit this application)'
    }
  ]
};

module.exports = {
  errors,
  messages,
  questions
};
