const compare = require('./compare');

describe('BasicEngine: Compare', () => {
  describe('string', () => {
    it('should correctly compare strings', () => {
      expect(compare('one', 'one')).toBe(true);
      expect(compare('one', 'one-')).toBe(false);
    });

    it('should ignore accents and capitalisation in strings', () => {
      expect(compare('oné', 'one')).toBe(true);
      expect(compare('übêr', 'Uber')).toBe(true);
    });
  });

  describe('date', () => {
    it('should ignore incorrectly formatted dates', () => {
      expect(compare('2019-01-01T08:00:00', '209-01-01T12:59:00')).toBe(false);
    });

    it('should exclude time from date matching', () => {
      expect(compare('2019-01-01T08:00:00', '2019-01-01T12:59:00')).toBe(true);
      expect(compare('2019-01-01T08:00:00', '2018-01-01T12:59:00')).toBe(false);
      expect(compare('2019-01-01T08:00:00', 'test')).toBe(false);
    });
  });

  describe('array', () => {
    it('should look within arrays for given search query', () => {
      expect(compare([1, 2, 3], 2)).toBe(true);
      expect(compare([1, 2, 3], 4)).toBe(false);
      expect(compare([1, 2, 3], 'test')).toBe(false);
    });
  });

  describe('boolean', () => {
    it('should match boolean string values', () => {
      expect(compare(true, 'true')).toBe(true);
      expect(compare(true, 'test')).toBe(false);
      expect(compare(false, 'test')).toBe(false);
      expect(compare(false, 'false')).toBe(true);
    });
  });

  describe('number', () => {
    it('should match integer values', function() {
      expect(compare(100, '42')).toBe(false);
      expect(compare(100, 'test')).toBe(false);
      expect(compare(100, '100')).toBe(true);
    });
  });

  describe('fallback', () => {
    it('should return FALSE when data type cannot be compared', () => {
      expect(compare(() => null, 'no-match')).toBe(false);
      expect(compare({}, 'no-match')).toBe(false);
    });
  });
});
