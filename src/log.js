const log = require('electron-log');

exports.info = (...info) => {
  console.log(...info);
  log.info(`[*]start-info:`, ...info);
}
