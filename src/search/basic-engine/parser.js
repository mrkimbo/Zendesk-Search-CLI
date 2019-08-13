function mapCollection(items) {
  return items.reduce((obj, item) => {
    return { ...obj, [item._id]: item };
  }, {});
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

// Pre-process data for search optimisation
function parse(rawData) {
  return {
    ...rawData,
    maps: createMapTables(rawData)
  };
}

module.exports = {
  parse
};
