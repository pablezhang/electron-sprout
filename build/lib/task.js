/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "tslib", "fancy-log", "ansi-colors"], function (require, exports, tslib_1, fancyLog, ansiColors) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function _isPromise(p) {
        if (typeof p.then === 'function') {
            return true;
        }
        return false;
    }
    function _renderTime(time) {
        return `${Math.round(time)} ms`;
    }
    function _execute(task) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const name = task.taskName || task.displayName || `<anonymous>`;
            if (!task._tasks) {
                fancyLog('Starting', ansiColors.cyan(name), '...');
            }
            const startTime = process.hrtime();
            yield _doExecute(task);
            const elapsedArr = process.hrtime(startTime);
            const elapsedNanoseconds = (elapsedArr[0] * 1e9 + elapsedArr[1]);
            if (!task._tasks) {
                fancyLog(`Finished`, ansiColors.cyan(name), 'after', ansiColors.magenta(_renderTime(elapsedNanoseconds / 1e6)));
            }
        });
    }
    function _doExecute(task) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Always invoke as if it were a callback task
            return new Promise((resolve, reject) => {
                if (task.length === 1) {
                    // this is a callback task
                    task((err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                    return;
                }
                const taskResult = task();
                if (typeof taskResult === 'undefined') {
                    // this is a sync task
                    resolve();
                    return;
                }
                if (_isPromise(taskResult)) {
                    // this is a promise returning task
                    taskResult.then(resolve, reject);
                    return;
                }
                // this is a stream returning task
                taskResult.on('end', _ => resolve());
                taskResult.on('error', err => reject(err));
            });
        });
    }
    function series(...tasks) {
        const result = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tasks.length; i++) {
                yield _execute(tasks[i]);
            }
        });
        result._tasks = tasks;
        return result;
    }
    exports.series = series;
    function parallel(...tasks) {
        const result = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield Promise.all(tasks.map(t => _execute(t)));
        });
        result._tasks = tasks;
        return result;
    }
    exports.parallel = parallel;
    function define(name, task) {
        if (task._tasks) {
            // This is a composite task
            const lastTask = task._tasks[task._tasks.length - 1];
            if (lastTask._tasks || lastTask.taskName) {
                // This is a composite task without a real task function
                // => generate a fake task function
                return define(name, series(task, () => Promise.resolve()));
            }
            lastTask.taskName = name;
            task.displayName = name;
            return task;
        }
        // This is a simple task
        task.taskName = name;
        task.displayName = name;
        return task;
    }
    exports.define = define;
});
