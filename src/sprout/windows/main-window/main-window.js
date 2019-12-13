//@ts-check
'use strict';

const bootstrapWindow = require('../../../bootstrap-window');

bootstrapWindow.load([
	'sprout/windows/main-window/mainwindow.initservices'
], (mainWindow, configuration) => {
	return require('../../windows/main-window/index').main(configuration);
}, {});
