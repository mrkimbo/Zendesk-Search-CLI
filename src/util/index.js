const clearConsole = require('clear');
const { messages } = require('../config/strings');
const { PAGE_SIZE } = require('../config/constants');

function clearScreen(...subHeaders) {
  clearConsole();
  console.log(messages.APP_HEADER);
  if (subHeaders.length) {
    console.log(subHeaders.join('\n'));
  }
}

function paginate(results) {
  const pages = [];
  let i = 0;
  while (i < results.length) {
    pages.push(results.slice(i, i + PAGE_SIZE));
    i += PAGE_SIZE;
  }

  return pages;
}

function getItemTitle({ _id, name, subject }) {
  return `${name || subject} (${_id})`;
}

const capitalise = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

module.exports = {
  getItemTitle,
  clearScreen,
  capitalise,
  paginate
};
