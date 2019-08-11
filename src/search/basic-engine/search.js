const parser = require('./parser');
const compare = require('./compare');

let data;

function reset() {
  data = {};
}

function init(rawData) {
  reset();
  data = parser(rawData);
}

async function search({ scope, field, query }) {
  const collection = data[scope.toLowerCase()];
  return collection.filter((item) => {
    // exact match only
    const value = item[field];
    return !!value && value === query;
  });
}

function getSearchableFields(model) {
  try {
    // risk here in case not all entries contain all available fields
    return Object.keys(data[model.toLowerCase()][0]);
  } catch (err) {
    return [];
  }
}

module.exports = {
  init,
  search,
  getSearchableFields
};
