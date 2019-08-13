const search = require('./search');
const { parse } = require('./parser');
const compare = require('./compare');

jest.mock('./parser', () => ({
  parse: jest.fn((data) => data)
}));
jest.mock('./compare', () => jest.fn(() => true));

describe('BasicEngine: Search', () => {
  beforeEach(() => {
    search.data = {
      test: [
        {
          _id: '1',
          value: 'one'
        }
      ]
    };
  });

  it('should conform to a search interface', () => {
    expect(search).toHaveProperty('init');
    expect(search).toHaveProperty('search');
    expect(search).toHaveProperty('getFields');
  });

  describe('init', function() {
    it('should call the parser init', () => {
      search.init({
        organisations: [],
        tickets: [],
        users: []
      });

      expect(parse).toHaveBeenCalledWith(
        expect.objectContaining({
          organisations: expect.any(Array),
          tickets: expect.any(Array),
          users: expect.any(Array)
        })
      );
    });
  });

  describe('Search', () => {
    it('should use the map tables for _id searches', async () => {
      search.maps = {
        test: { 1: { value: 'test-result' } }
      };

      const result = await search.search({ scope: 'test', field: '_id', query: 1 });
      expect(result).toEqual([{ value: 'test-result' }]);
    });

    it('should use the comparison engine for value searches', async () => {
      await search.search({ scope: 'test', field: 'value', query: 'two' });
      expect(compare).toHaveBeenCalledWith('one', 'two');
    });
  });

  describe('getFields', () => {
    it('should fetch the available fields for a scope', () => {
      const fields = search.getFields('test');
      expect(fields).toEqual(['_id', 'value']);
    });

    it('should return an empty array when an error occurs', () => {
      const fields = search.getFields('invalid-scope');
      expect(fields).toEqual([]);
    });
  });
});
