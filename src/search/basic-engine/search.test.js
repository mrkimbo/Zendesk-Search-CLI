const engine = require('./search');
const { parse } = require('./parser');
const compare = require('./compare');

jest.mock('./parser', () => ({
  parse: jest.fn((data) => data)
}));
jest.mock('./compare', () => jest.fn(() => true));

describe('BasicEngine: Search', () => {
  beforeEach(() => {
    engine.data = { test: [{ _id: '1', value: 'one' }] };
    engine.fields = { test: { _id: 'string', value: 'string' } };
  });

  it('should conform to a search interface', () => {
    expect(engine).toHaveProperty('init');
    expect(engine).toHaveProperty('search');
    expect(engine).toHaveProperty('getFields');
  });

  describe('init', function() {
    it('should call the parser init', () => {
      engine.init({
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
      engine.maps = {
        test: { 1: { value: 'test-result' } }
      };

      const result = await engine.search({ scope: 'test', field: '_id', query: 1 });
      expect(result).toEqual([{ value: 'test-result' }]);
    });

    it('should use the comparison engine for value searches', async () => {
      await engine.search({ scope: 'test', field: 'value', query: 'two' });
      expect(compare).toHaveBeenCalledWith('string', 'one', 'two');
    });
  });

  describe('getFields', () => {
    it('should fetch the available fields for a scope', () => {
      const fields = engine.getFields('test');
      expect(fields).toEqual(['_id', 'value']);
    });

    it('should return an empty array when an error occurs', () => {
      const fields = engine.getFields('invalid-scope');
      expect(fields).toEqual([]);
    });
  });
});
