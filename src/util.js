const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pluralise = (word, count) => `${word}${count > 1 ? 's' : ''}`;

const mockProcessTime = (fn, ms = 500) => async (...args) => {
  const T = Date.now();
  const result = await fn(...args);
  const execTime = Date.now() - T;
  if (execTime < ms) {
    await delay(ms - execTime);
  }

  return result;
};

module.exports = {
  delay,
  pluralise,
  mockProcessTime
};
