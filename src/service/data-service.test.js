const service = require('./data-service');

describe('DataService', () => {
  it('should load the raw data files', async () => {
    const result = await service.load();
    expect(result).toEqual(
      expect.objectContaining({
        organisations: expect.any(Object),
        tickets: expect.any(Object),
        users: expect.any(Object)
      })
    );
  });
});
