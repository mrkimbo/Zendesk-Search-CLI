const util = require('./index');
const clear = require('clear');

jest.mock('../config/constants', () => ({
  PAGE_SIZE: 2
}));

jest.mock('clear', () => jest.fn());

describe('util', () => {
  describe('clearScreen', () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should clear the screen contents', function() {
      util.clearScreen();
      expect(clear).toHaveBeenCalled();
    });

    it('should log all given messages', function() {
      jest.spyOn(console, 'log');
      util.clearScreen('hello', 'test');

      expect(console.log).toHaveBeenCalledWith('hello\ntest');
    });
  });

  describe('paginate', () => {
    it('should slice an array into pages', function() {
      expect(util.paginate([1, 2, 3])).toEqual([[1, 2], [3]]);
    });
  });

  describe('getItemTitle', () => {
    it('should return a string containing the name and id of the item', () => {
      expect(util.getItemTitle({ _id: 1, name: 'name' })).toBe('name (1)');
    });

    it('should use the subject if the name is not present', () => {
      expect(util.getItemTitle({ _id: 1, subject: 'subject' })).toBe('subject (1)');
    });
  });

  describe('captialise', () => {
    it('should convert the first letter of a string to uppercase', function() {
      expect(util.capitalise('hello')).toBe('Hello');
    });
  });
});
