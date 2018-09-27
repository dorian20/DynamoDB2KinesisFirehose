/**
 * Author @nadir93
 * Date 2018.6.17
 */
const proc = require('./lib/proc');
const log = require('./lib/log');

let callback = null;

function success() {
  callback(null, 'success');
}

function fail(e) {
  callback(e);
}

const execute = async (event, context, cb) => {

  callback = cb;
  log.debug('received event:', JSON.stringify(event, null, 2));

  try {
    await proc(event);
    success();
  } catch (e) {
    fail(e);
  };
}

process.on('unhandledRejection', (reason, p) => {
  log.debug('reason: ', reason);
  log.debug('p: ', p);
  throw reason;
});

process.on('uncaughtException', (e) => {
  log.debug('uncaughtException: ', e);
  log.error(e);
});

exports.handler = execute;