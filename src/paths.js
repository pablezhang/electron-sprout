/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

// @ts-ignore
const pkg = require('../package.json');
const path = require('path');
const os = require('os');

/**
 * @param {string} platform
 * @returns {string}
 */
const getAppDataPath = (platform) => {
	switch (platform) {
		case 'win32': return process.env['APPDATA'] || path.join(process.env['USERPROFILE'], 'AppData', 'Roaming');
		case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support');
		case 'linux': return process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config');
		default: throw new Error('Platform not supported');
	}
}

/**
 * @param {string} platform
 * @returns {string}
 */
const getDefaultUserDataPath = (platform) => {
	return path.join(getAppDataPath(platform), pkg.name);
}

const getFlashPath = (platform) => {
  const basePath = path.join(this.getDefaultUserDataPath(platform), '/flash').replace('file:', '');
	switch (platform) {
		case 'win32': return `${basePath}/pepflashplayer.dll` ;
		case 'darwin': `${basePath}/PepperFlashPlayer.plugin`;
		default: '';
  }
}

exports.getAppDataPath = getAppDataPath;
exports.getDefaultUserDataPath = getDefaultUserDataPath;
exports.getFlashPath = getFlashPath;
