const app = require('./app');
const ui = require('./ui');

// mock out all ui methods
jest.mock('./ui', () => ({
  gatherInput: jest.fn(),
  displaySingleResult: jest.fn(),
  displayResultsList: jest.fn(),
  displayEmptyResults: jest.fn(),
  displayAssociatedData: jest.fn()
}));

describe('App', () => {
  describe('performSearch', () => {
    beforeEach(() => {
      app.performSearch();
    });

    it('should prompt the user for search input', () => {
      expect(ui.gatherInput).toHaveBeenCalled();
    });
  });
});
