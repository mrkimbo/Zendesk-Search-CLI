const { scopes } = require('./constants');
const { capitalise } = require('../util');

module.exports = {
  search: {
    scope: [
      {
        name: 'scope',
        type: 'list',
        message: 'What would you like to search for?',
        default: 'Organisations',
        filter: (selection) => selection.toLowerCase(),
        choices: Object.values(scopes).map(capitalise)
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
  results: (choices) => [
    {
      name: 'selection',
      type: 'list',
      message: `Select result to view`,
      pageSize: 12,
      choices
    }
  ],
  showAssociated: [
    {
      type: 'confirm',
      name: 'showAssociated',
      default: 'y',
      message: 'Show associated data?'
    }
  ],
  restart: [
    {
      type: 'confirm',
      name: 'restart',
      default: 'y',
      message: `Search again?`
    }
  ]
};
