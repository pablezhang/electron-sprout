import path from 'path';
import { app } from 'electron';
import * as paths from './paths';
import * as log from './log';
import { PROCESS_ENV as processEnv } from './config';
import * as util from './util';
import { CodeMain } from './sprout/main';

const product = require('../product.json');

interface IOptions {
  flash?: boolean;
}
/**
 * app入口
 */
class MainEntrance {
  private options: IOptions;
  private userDataPath: string;

  constructor(options: IOptions) {
    this.options = options;

    this.setUserDataPath();
    log.info('启动options:', options);
    this.initEnvironment();
  }

  public initEnvironment() {

    this.setCurrentWorkingDirectory();

    this.configureCommandlineSwitches();

    app.once('ready', () => this.onReady());
  }

  private onReady() {
    const nodeCachedDataDir = this.getNodeCachedDir();
    Promise.all([nodeCachedDataDir.ensureExists()]).then(([cachedDataDir]) => {
      process.env[processEnv.SPROUT_NODE_CACHED_DATA_DIR] = cachedDataDir || '';
      new CodeMain().main();
    })
  }

  private getNodeCachedDir() {
    return new class {
      private value: undefined | string;
      constructor() {
        this.value = this._compute();
      }

      ensureExists(): Promise<string | void> {
        return util.mkdirp(this.value).then(() => this.value, () => { /*ignore*/ });
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


  private configureCommandlineSwitches(): void {
     // Force pre-Chrome-60 color profile handling (for https://github.com/Microsoft/vscode/issues/51791)
     app.commandLine.appendSwitch('disable-color-correct-rendering');

     this.initFlashPlugin();
  }

  private initFlashPlugin(): void {
    if (this.options && this.options.flash) {
      const flashPath = paths.getFlashPath(process.platform);
      console.log('flashPath:', flashPath);
      app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
    }
  }

  private setCurrentWorkingDirectory(): void {
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

  private setUserDataPath(): string {
    log.info('_getUserDataPath-platform:', process.platform);
    if (!this.userDataPath) {
      this.userDataPath = path.resolve(paths.getDefaultUserDataPath(process.platform));
    }
    log.info('userDataPath:', this.userDataPath);
    app.setPath('userData', this.userDataPath);
    return this.userDataPath;
  }
}
new MainEntrance({
  flash: false, // whether support flash
});
