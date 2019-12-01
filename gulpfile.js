const gulp = require('gulp');
const path = require('path');

const util = require('./build/lib/util');
const task = require('./build/lib/task');
const compilation = require('./build/lib/compilation');


const watchClientTask = task.define('watch-client', task.series(util.rimraf('out'), compilation.watchTask('out', false)));
gulp.task(watchClientTask);

gulp.task(task.define('watch', task.parallel(/* monacoTypecheckWatchTask, */ watchClientTask)));

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	process.exit(1);
});

// Load all the gulpfiles only if running tasks other than the editor tasks
const build = path.join(__dirname, 'build');
require('glob').sync('gulpfile.*.js', { cwd: build })
	.forEach(f => require(`./build/${f}`));
