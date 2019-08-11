const createPipe = (...fns) => (arr) => fns.reduce((result, fn) => fn(result), arr);

function mapCollection(items) {
  return items.reduce((obj, item) => {
    return { ...obj, [item._id]: item };
  }, {});
}

// lookup table for organisations, users and tickets
let maps = {
  organisations: null,
  tickets: null,
  users: null
};

function createTables(rawData) {
  maps = Object.entries(rawData).reduce((obj, [key, val]) => {
    return {
      ...obj,
      [key]: mapCollection(val)
    };
  }, {});
}

function injectLinkedData(items) {
  const decoratorPipe = createPipe(injectOrgData, injectUserData);
  return items.map(decoratorPipe);
}

function injectOrgData(item) {
  const { organization_id: id } = item;
  if (id) {
    return {
      ...item,
      organization: maps.organisations[id]
    };
  }

  return item;
}

function injectUserData(item) {
  const { submitter_id: submitter, assignee_id: assignee } = item;
  if (submitter && assignee) {
    return {
      ...item,
      submitter: maps.users[submitter],
      assignee: maps.users[assignee]
    };
  }

  return item;
}

// pre-process data
function parseData(rawData) {
  const { organisations, tickets, users } = rawData;
  createTables(rawData);

  return {
    organisations,
    tickets: injectLinkedData(tickets),
    users: injectLinkedData(users)
  };
}

module.exports = parseData;
