const isSameDay = require('date-fns/is_same_day');

// Value comparison utils (not performance optimised)
const boolean = {
  type: 'boolean',
  test: (field) => ['true', 'false'].includes(field.toString()),
  compare: (field, query) => field.toString() === query
};

const number = {
  type: 'number',
  test: (field) => typeof field === 'number',
  compare: (field, query) => field === parseInt(query)
};

// compare number/string/boolean
const string = {
  type: 'string',
  test: (field) => !/(function|object)/.test(typeof field),
  compare: (field, query) =>
    field.toString().localeCompare(query.toString(), 'en', {
      sensitivity: 'base',
      usage: 'search'
    }) === 0
};

// find within array - only 1 level deep
const array = {
  type: 'array',
  test: (field) => Array.isArray(field),
  compare: (field, query) => field.some((item) => string.compare(item, query))
};

// compare date strings
const date = {
  type: 'date',
  test: (field) => {
    const trimmedDate = field.toString().replace(/\s-[\d:]+$/, '');
    return !/invalid/i.test(new Date(trimmedDate).toString());
  },
  compare: (field, query) => isSameDay(field, query)
};

// if all else fails.. (never produces matches)
const fallback = {
  type: 'fallback',
  test: () => true,
  compare: () => false
};

// Value comparison function list (chain of responsibility)
const comparators = [boolean, number, array, date, string, fallback];

// Poss improvement: on initial parsing, create table of field -> data-types to avoid checking during search
function compare(field = '', query = '') {
  const { compare, type } = comparators.find(({ test }) => test(field));
  return compare(field, query);
}

module.exports = compare;
