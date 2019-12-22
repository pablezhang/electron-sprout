export const uriFromPath = (_path: string): string => {
	const path = require('path');

	let pathName = path.resolve(_path).replace(/\\/g, '/');
	if (pathName.length > 0 && pathName.charAt(0) !== '/') {
		pathName = '/' + pathName;
	}

	let uri: string;
	if (process.platform === 'win32' && pathName.startsWith('//')) { // specially handle Windows UNC paths
		uri = encodeURI('file:' + pathName);
	} else {
		uri = encodeURI('file://' + pathName);
	}

	return uri.replace(/#/g, '%23');
};

export const readFile = (file: string): Promise<string> => {
	const fs = require('fs');
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', (err: Error, data: any) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
};

export const writeFile = (file: string, content: string) => {
	const fs = require('fs');

	return new Promise((resolve, reject) => {
		fs.writeFile(file, content, 'utf8', (err: Error) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
};

const mkdir = (dir: string): Promise<string> => {
	const fs = require('fs');
	return new Promise((c, e) => fs.mkdir(dir, (err) => (err && err.code !== 'EEXIST') ? e(err) : c(dir)));
}

export const mkdirp = (dir: string): Promise<string> => {
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
