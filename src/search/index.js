const engine = require('./basic-engine');
const { getItemTitle } = require('../util');
const { messages, errors } = require('../config/strings');
const { scopes } = require('../config/constants');

// Helper for fetching associated data and formatting the results
async function searchRelated(scope, field, query) {
  const results = await engine.search({ scope, field, query });
  return results.map(getItemTitle);
}

// facade for search engine
module.exports = {
  init: async (rawData) => {
    console.log(messages.PARSE_START);
    engine.init(rawData);
  },

  getFields: (model) => {
    const fields = engine.getFields(model);
    if (!fields.length) {
      console.log(errors.NO_SEARCHABLE_FIELDS);
    }

    // should exit at this point?
    return fields;
  },

  search: async (query) => {
    try {
      return await engine.search(query);
    } catch (err) {
      return [];
    }
  },

  getAssociatedData: async (scope, result) => {
    const { _id, organization_id, assignee_id, submitter_id } = result;

    if (scope === scopes.ORGANISATIONS) {
      const { _id } = result;
      return {
        tickets: await searchRelated(scopes.TICKETS, 'organization_id', _id),
        users: await searchRelated(scopes.USERS, 'organization_id', _id)
      };
    }

    if (scope === scopes.TICKETS) {
      return {
        organisation: await searchRelated(scopes.ORGANISATIONS, '_id', organization_id),
        assignee: await searchRelated(scopes.USERS, '_id', assignee_id),
        submitter: await searchRelated(scopes.USERS, '_id', submitter_id)
      };
    }

    if (scope === scopes.USERS) {
      return {
        organisation: await searchRelated(scopes.ORGANISATIONS, '_id', organization_id),
        tickets: Array.from(
          // remove duplicates
          new Set([
            ...(await searchRelated(scopes.TICKETS, 'submitter_id', _id)),
            ...(await searchRelated(scopes.TICKETS, 'assignee_id', _id))
          ]).values()
        )
      };
    }
  }
};
