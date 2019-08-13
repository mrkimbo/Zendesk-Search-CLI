const Parser = require('./parser');
const compare = require('./compare');

class Search {
  init(rawData) {
    const { maps, ...data } = Parser.parse(rawData);
    this.data = data;
    this.maps = maps;
  }

  async search({ scope, field, query }) {
    // optimised search by id:
    if (field === '_id') {
      return [this.maps[scope][query.toString()]];
    }

    // long-hand value search
    const collection = this.data[scope];
    return collection.filter((item) => compare(item[field], query));
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
