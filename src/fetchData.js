const { messages } = require('./strings');
const { mockProcessTime } = require('./util');

async function fetchData() {
  console.log(messages.LOAD_START);
  return {
    organisations: require('../data/organizations'),
    tickets: require('../data/tickets'),
    users: require('../data/users')
  };
}

module.exports = mockProcessTime(fetchData);
