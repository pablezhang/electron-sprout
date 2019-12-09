const path = require('path');

const bootstrap = require('./bootstrap');
const processEnv = require('./config').PROCESS_ENV;

const product = require('../product.json');

const { app } = require('electron');

const paths = require('./paths');
const log = require('./log');


class MainEntrance {
  /**
   * options = { flash?: boolean }
   */
  constructor(options) {
    this.options = options; // 加载选项

    this._setUserDataPath();
    log.info('启动options:', options);
    this.initEnvironment();
  }

  initEnvironment() {
    // Enable ASAR support
    bootstrap.enableASARSupport();

    this._setCurrentWorkingDirectory();

    this._configureCommandlineSwitches();

    app.once('ready', () => this._onReady());
  }

  _onReady() {
    const nodeCachedDataDir = this._getNodeCachedDir();
    Promise.all([nodeCachedDataDir.ensureExists()]).then(([cachedDataDir]) => {
      process.env[processEnv.SPROUT_NODE_CACHED_DATA_DIR] = cachedDataDir || '';
      log.info('ready to start');
      require('./bootstrap-amd').load('sprout/event-test', () => {
        log.info('start done');
      });
    })
  }


  _setCurrentWorkingDirectory() {
    try {
      if (process.platform === 'win32') {
        process.env[processEnv.SPROUT_CWD] = process.cwd(); // remember as environment variable
        log.info(`current cwd:${process.cwd()}`);
        process.chdir(path.dirname(app.getPath('exe'))); // always set application folder as cwd
      } else if (process.env[processEnv.SPROUT_CWD]) {
        process.chdir(process.env[processEnv.SPROUT_CWD]);
      }
    } catch (err) {
      console.error(err);
    }
  }

// get app data absolute path
_setUserDataPath() {
  log.info('_getUserDataPath-platform:', process.platform);
  if (!this.userDataPath) {
    this.userDataPath = path.resolve(paths.getDefaultUserDataPath(process.platform));
  }
  log.info('userDataPath:', this.userDataPath);
  app.setPath('userData', this.userDataPath);
  return this.userDataPath;
}

_configureCommandlineSwitches() {
  // Force pre-Chrome-60 color profile handling (for https://github.com/Microsoft/vscode/issues/51791)
  app.commandLine.appendSwitch('disable-color-correct-rendering');

  this._initFlashPlugin();

}

_initFlashPlugin() {
  if (this.options && this.options.flash) {
    const flashPath = paths.getFlashPath(process.platform);
    console.log('flashPath:', flashPath);
    app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
  }
}

  /**
 * @returns {{ ensureExists: () => Promise<string | void> }}
 */
_getNodeCachedDir() {
	return new class {

		constructor() {
			this.value = this._compute();
		}

		ensureExists() {
			return bootstrap.mkdirp(this.value).then(() => this.value, () => { /*ignore*/ });
		}

		_compute() {
			if (process.argv.indexOf('--no-cached-data') > 0) {
				return undefined;
			}

			// IEnvironmentService.isBuilt
			if (process.env[processEnv.SPROUT_DEV]) {
				return undefined;
			}

			// find commit id
			const commit = product.commit;
			if (!commit) {
				return undefined;
			}
      log.info('this.commit:', commit);
			return path.join(path.resolve(paths.getDefaultUserDataPath(process.platform)), 'CachedData', commit);
		}
	};
}


}

console.log('exec main js');

new MainEntrance({
  flash: false, // whether support flash
});
