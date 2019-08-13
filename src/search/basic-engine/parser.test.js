const parser = require('./parser');

describe('BasicEngine: Parser', () => {
  let rawData;
  let result;
  beforeEach(() => {
    rawData = {
      numbers: [{ _id: 1, value: 'one' }, { _id: 2, value: 'two' }],
      names: [{ _id: 1, value: 'kim' }, { _id: 2, value: 'bob' }]
    };

    result = parser.parse(rawData);
  });

  it('should return the raw data file content', () => {
    expect(result).toEqual(
      expect.objectContaining({
        numbers: rawData.numbers,
        names: rawData.names
      })
    );
  });

  it('should return an id-indexed table for each collection', () => {
    const { numbers, names } = result.maps;

    expect(numbers).toEqual({
      1: { _id: 1, value: 'one' },
      2: { _id: 2, value: 'two' }
    });
    expect(names).toEqual({
      1: { _id: 1, value: 'kim' },
      2: { _id: 2, value: 'bob' }
    });
  });
});
