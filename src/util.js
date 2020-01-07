"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uriFromPath = (_path) => {
    const path = require('path');
    let pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    let uri;
    if (process.platform === 'win32' && pathName.startsWith('//')) { // specially handle Windows UNC paths
        uri = encodeURI('file:' + pathName);
    }
    else {
        uri = encodeURI('file://' + pathName);
    }
    return uri.replace(/#/g, '%23');
};
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
const mkdir = (dir) => {
    const fs = require('fs');
    return new Promise((c, e) => fs.mkdir(dir, (err) => (err && err.code !== 'EEXIST') ? e(err) : c(dir)));
};
exports.mkdirp = (dir) => {
    const path = require('path');
    return mkdir(dir).then(null, err => {
        if (err && err.code === 'ENOENT') {
            const parent = path.dirname(dir);
            if (parent !== dir) { // if not arrived at root
                return exports.mkdirp(parent).then(() => mkdir(dir));
            }
        }
        throw err;
    });
};
