const isSameDay = require('date-fns/is_same_day');

// Value comparison utils (not performance optimised)
const boolean = (field, query) => field.toString() === query.toString();
const number = (field, query) => field.toString() === query.toString();
const string = (field, query) =>
  // issue: assume data inside arrays is string
  field.toString().localeCompare(query.toString(), 'en', {
    sensitivity: 'base',
    usage: 'search'
  }) === 0;
const date = (field, query) => isSameDay(field, query);
const array = (field, query) => field.some((item) => string(item, query));

const comparators = {
  boolean,
  number,
  string,
  date,
  array,
  unsupported: () => false
};

function compare(type, field = '', query = '') {
  return comparators[type](field, query);
}

module.exports = compare;
