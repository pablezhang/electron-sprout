import log from 'electron-log';

export const info = (...info: any) => {
  console.log(...info);
  log.info(`[*]start-info:`, ...info);
}
