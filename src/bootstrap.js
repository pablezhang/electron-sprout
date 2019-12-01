// add traceLimit
Error.stackTraceLimit = 10;

// Workaround for Electron not installing a handler to ignore SIGPIPE
// (https://github.com/electron/electron/issues/13254)
// @ts-ignore
process.on('SIGPIPE', () => {
    console.error(new Error('Unexpected SIGPIPE'));
});

// Add support for redirecting the loading of node modules
exports.injectNodeModuleLookupPath = (injectPath) => {
    if (!injectPath) {
		throw new Error('Missing injectPath');
    }
    const Module = require('module');
	const path = require('path');

	const nodeModulesPath = path.join(__dirname, '../../node_modules');

	// @ts-ignore
	const originalResolveLookupPaths = Module._resolveLookupPaths;

	// @ts-ignore
	Module._resolveLookupPaths = function (moduleName, parent) {
		const paths = originalResolveLookupPaths(moduleName, parent);
		for (let i = 0, len = paths.length; i < len; i++) {
			if (paths[i] === nodeModulesPath) {
				paths.splice(i, 0, injectPath);
				break;
			}
		}

		return paths;
	};
}

/**
 * @param {string=} nodeModulesPath
 */
exports.enableASARSupport = function (nodeModulesPath) {

	// @ts-ignore
	const Module = require('module');
	const path = require('path');

	let NODE_MODULES_PATH = nodeModulesPath;
	if (!NODE_MODULES_PATH) {
		NODE_MODULES_PATH = path.join(__dirname, '../node_modules');
	}

	const NODE_MODULES_ASAR_PATH = NODE_MODULES_PATH + '.asar';

	// @ts-ignore
	const originalResolveLookupPaths = Module._resolveLookupPaths;

	// @ts-ignore
	Module._resolveLookupPaths = function (request, parent) {
		const paths = originalResolveLookupPaths(request, parent);
		for (let i = 0, len = paths.length; i < len; i++) {
			if (paths[i] === NODE_MODULES_PATH) {
				paths.splice(i, 0, NODE_MODULES_ASAR_PATH);
				break;
			}
		}

		return paths;
	};
};

exports.uriFromPath = function (_path) {
	const path = require('path');

	let pathName = path.resolve(_path).replace(/\\/g, '/');
	if (pathName.length > 0 && pathName.charAt(0) !== '/') {
		pathName = '/' + pathName;
	}

	/** @type {string} */
	let uri;
	if (process.platform === 'win32' && pathName.startsWith('//')) { // specially handle Windows UNC paths
		uri = encodeURI('file:' + pathName);
	} else {
		uri = encodeURI('file://' + pathName);
	}

	return uri.replace(/#/g, '%23');
};


/**
 * @param {string} file
 * @returns {Promise<string>}
 */
exports.readFile = (file) => {
	const fs = require('fs');

	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
};

/**
 * @param {string} file
 * @param {string} content
 * @returns {Promise<void>}
 */
exports.writeFile = (file, content) => {
	const fs = require('fs');

	return new Promise((resolve, reject) => {
		fs.writeFile(file, content, 'utf8', (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
};

/**
 * @param {string} dir
 * @returns {Promise<string>}
 */
const mkdir = (dir) => {
	const fs = require('fs');
	return new Promise((resolve, reject) => fs.mkdir(dir, err => (err && err.code !== 'EEXIST') ? reject(err) : resolve(dir)));
}

/**
 * @param {string} dir
 * @returns {Promise<string>}
 * create the parent dir if not exit by recursion
 */
exports.mkdirp = (dir) => {
	const path = require('path');

	return mkdir(dir).then(null, err => {
		if (err && err.code === 'ENOENT') {
			const parent = path.dirname(dir);
			if (parent !== dir) { // if not arrived at root
				return mkdirp(parent).then(() => mkdir(dir));
			}
		}

		throw err;
	});
};
