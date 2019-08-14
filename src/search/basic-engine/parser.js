const DATA_TYPE_WHITELIST = ['string', 'number', 'boolean', 'array', 'date'];

// Identify field data types
function resolveDataType(value) {
  let type = typeof value;

  if (Array.isArray(value)) {
    type = 'array';
  }

  // check for date type
  if (type === 'string') {
    const trimmedDate = value.replace(/\s-[\d:]+$/, '');
    if (!/invalid/i.test(new Date(trimmedDate).toString())) {
      type = 'date';
    }
  }

  // check type is supported
  if (!DATA_TYPE_WHITELIST.includes(type)) {
    return 'unsupported';
  }

  return type;
}

function mapCollection(items) {
  return items.reduce((obj, item) => {
    return { ...obj, [item._id]: item };
  }, {});
}

function mapFields(obj) {
  return Object.entries(obj).reduce(
    (obj, [key, val]) => ({
      ...obj,
      [key]: resolveDataType(val)
    }),
    {}
  );
}

// Create look-up tables for fast data access by id
function createMapTables(rawData) {
  return Object.entries(rawData).reduce((obj, [key, val]) => {
    return {
      ...obj,
      [key]: mapCollection(val)
    };
  }, {});
}

// Create cache tables for field data types
function createFieldTables(rawData) {
  return Object.entries(rawData).reduce((obj, [key, val]) => {
    return {
      ...obj,
      [key]: mapFields(val[0])
    };
  }, {});
}

// Pre-process data for search optimisation
function parse(rawData) {
  return {
    ...rawData,
    maps: createMapTables(rawData),
    fields: createFieldTables(rawData)
  };
}

module.exports = {
  parse
};
