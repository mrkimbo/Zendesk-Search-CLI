const facade = require('./index');
const engine = require('./basic-engine');

jest.mock('./basic-engine', () => ({
  init: jest.fn(),
  getFields: jest.fn(() => ['_id', 'value']),
  search: jest.fn(() => [])
}));

describe('Search Facade', () => {
  it('should expose wrappers around the search functionality', () => {
    expect(facade).toHaveProperty('init');
    expect(facade).toHaveProperty('getFields');
    expect(facade).toHaveProperty('search');
    expect(facade).toHaveProperty('getAssociatedData');
  });

  describe('init', () => {
    it('should proxy the initialise method on the engine', () => {
      facade.init({});
      expect(engine.init).toHaveBeenCalledWith({});
    });
  });

  describe('search', () => {
    it('should proxy the search method on the engine', () => {
      const query = {
        scope: 'test',
        field: '_id',
        query: '1'
      };
      facade.search(query);

      expect(engine.search).toHaveBeenCalledWith(query);
    });

    it('should return the search results', async () => {
      engine.search.mockImplementation(async () => [1, 2, 3]);
      const result = await facade.search();

      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle errors from the search engine', async () => {
      engine.search.mockImplementation(async () => {
        throw new Error('search-failed');
      });
      const result = await facade.search();

      expect(result).toEqual([]);
    });
  });

  describe('getFields', () => {
    it('should proxy the getFields method on the engine', () => {
      facade.getFields('test');
      expect(engine.getFields).toHaveBeenCalledWith('test');
    });
  });

  describe('getAssociatedData', () => {
    it('should proxy the search method on the engine', async () => {
      await facade.getAssociatedData('test', {});
      expect(engine.search).toHaveBeenCalled();
    });

    it('should return tickets and users for an organisation', async () => {
      engine.search.mockReturnValue([{ _id: 1, name: 'test' }]);
      const result = await facade.getAssociatedData('organisations', {});

      expect(result).toEqual(
        expect.objectContaining({
          tickets: expect.any(Array),
          users: expect.any(Array)
        })
      );
    });

    it('should return organisation, submitter and assignee for a ticket', async () => {
      engine.search.mockReturnValue([{ _id: 1, name: 'test' }]);
      const result = await facade.getAssociatedData('tickets', {});

      expect(result).toEqual(
        expect.objectContaining({
          organisation: expect.any(Array),
          submitter: expect.any(Array),
          assignee: expect.any(Array)
        })
      );
    });

    it('should return organisation and tickets for a user', async () => {
      engine.search.mockReturnValue([{ _id: 1, name: 'test' }]);
      const result = await facade.getAssociatedData('users', {});

      expect(result).toEqual(
        expect.objectContaining({
          organisation: expect.any(Array),
          tickets: expect.any(Array)
        })
      );
    });
  });
});
