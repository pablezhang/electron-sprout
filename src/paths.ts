import path from 'path';
import os from 'os';

const pkg = require('../package.json');

export const getAppDataPath = (platform: string) => {
	switch (platform) {
		case 'win32': return process.env['APPDATA'] || path.join(process.env['USERPROFILE'], 'AppData', 'Roaming');
		case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support');
		case 'linux': return process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config');
		default: throw new Error('Platform not supported');
	}
}


export const getDefaultUserDataPath = (platform: string) => {
	return path.join(getAppDataPath(platform), pkg.name);
}

export const getFlashPath = (platform: string) => {
  const basePath = path.join(this.getDefaultUserDataPath(platform), '/flash').replace('file:', '');
	switch (platform) {
		case 'win32': return `${basePath}/pepflashplayer.dll` ;
		case 'darwin': `${basePath}/PepperFlashPlayer.plugin`;
		default: '';
  }
}

