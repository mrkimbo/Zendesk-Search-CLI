const Parser = require('./parser');
const compare = require('./compare');

class Search {
  init(rawData) {
    const { maps, fields, ...data } = Parser.parse(rawData);
    this.data = data;
    this.maps = maps;
    this.fields = fields;
  }

  async search({ scope, field, query }) {
    // use lookup tables for id searches:
    if (field === '_id') {
      return [this.maps[scope][query.toString()]];
    }

    // long-hand value search
    const collection = this.data[scope];
    const dataType = this.fields[scope][field];
    return collection.filter((item) => compare(dataType, item[field], query));
  }

  getFields(scope) {
    try {
      // risk here in case not all entries contain all available fields
      return Object.keys(this.data[scope][0]);
    } catch (err) {
      return [];
    }
  }
}

module.exports = new Search();
