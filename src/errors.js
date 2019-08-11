const { errors, messages } = require('./strings');
const isDebug = process.argv.includes('--debug');

function exit(msg) {
  process.stdout.write(msg);
  process.exit(0);
}

const programEvents = {
  uncaughtException: errors.FATAL_ERROR,
  unhandledRejection: errors.FATAL_ERROR,
  exit: messages.EXIT
};

Object.entries(programEvents).forEach(([eventName, message]) => {
  process.on(eventName, (err) => {
    if (err && isDebug) {
      console.error(err);
    }

    exit(`\n${message}\n\n`);
  });
});
