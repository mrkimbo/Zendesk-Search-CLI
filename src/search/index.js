const engine = require('./basic-engine');
const { mockProcessTime } = require('../util');
const { messages, errors } = require('../strings');

module.exports = {
  init: mockProcessTime(async (rawData) => {
    console.log(messages.PARSE_START);
    engine.init(rawData);
  }),

  getSearchableFields: (model) => {
    const fields = engine.getSearchableFields(model);
    if (!fields) {
      console.log(errors.NO_SEARCHABLE_FIELDS);
    }

    return fields;
  },

  search: mockProcessTime(async (query) => {
    console.log(messages.SEARCH_START);
    return engine.search(query);
  })
};
