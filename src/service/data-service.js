const { messages } = require('../config/strings');

async function load() {
  console.log(messages.LOAD_START);
  return {
    organisations: require('../data/organizations'),
    tickets: require('../data/tickets'),
    users: require('../data/users')
  };
}

module.exports = {
  load
};
