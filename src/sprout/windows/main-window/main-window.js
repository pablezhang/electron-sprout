//@ts-check
'use strict';

const bootstrapWindow = require('../../../bootstrap-window');

console.log('main-window service');
bootstrapWindow.load([
	'sprout/windows/main-window/mainwindow.initservices',
], (mainWindow, configuration) => {
	// @ts-ignore
	return require('sprout/windows/main-window/index').main(configuration).then(() => {
		bootstrapWindow.load(['sprout/windows/main-window/electron-render/index'], () => {
			// @ts-ignore
			const { startMainWindowRender } = require('sprout/windows/main-window/electron-render/index');
			startMainWindowRender();
		})
	});
}, {});
