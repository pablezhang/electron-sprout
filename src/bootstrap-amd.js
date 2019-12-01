const loader = require('./loader');
const bootstrap = require('./bootstrap');
const processEnv = require('./config').PROCESS_ENV;
// Bootstrap: Loader
loader.config({
	baseUrl: bootstrap.uriFromPath(__dirname),
	catchError: true,
	nodeRequire: require,
	nodeMain: __filename
});

// Running in Electron
// there some differences between `electorn fs` and node `fs`
// such .asar file will be `a zipfile in node` but `a dir in electron` when use fs to read
// this will have problems when you try to unzip a zip with `.asar` in electron
// 在electron直接调用fs 和使用三方包的表现来调用尝试一波
if (process.env[processEnv.ELECTRON_RUN_AS_NODE] || process.versions['electron']) {
	loader.define('fs', ['original-fs'], (originalFS) => {
		return originalFS;  // replace the patched electron fs with the original node fs for all AMD code
	});
}

exports.load = function (entrypoint, onLoad, onError) {
	if (!entrypoint) {
		return;
  }

	// cached data config
	if (process.env[processEnv.SPROUT_NODE_CACHED_DATA_DIR]) {
		loader.config({
			nodeCachedData: {
				path: process.env[processEnv.SPROUT_NODE_CACHED_DATA_DIR],
				seed: entrypoint
			}
		});
	}

	onLoad = onLoad || function () { };
	onError = onError || function (err) { console.error(err); };

	loader([entrypoint], onLoad, onError);
};