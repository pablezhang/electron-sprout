define(["require", "exports", "tslib", "sprout/base/common/lifecycle", "electron", "sprout/base/utils/log"], function (require, exports, tslib_1, lifecycle_1, electron_1, log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultWindowState = function (mode = 1 /* Normal */) {
        return {
            width: 1276,
            height: 795,
            mode
        };
    };
    const RUN_TEXTMATE_IN_WORKER = false;
    class CodeWindow extends lifecycle_1.Disposable {
        constructor(config) {
            super();
            // create browser window
            this.createBrowserWindow(config);
        }
        get id() {
            return this._id;
        }
        get lastFocusTime() {
            return this._lastFocusTime;
        }
        get win() {
            return this._win;
        }
        restoreWindowState(state) {
            // TODO: @pikun
            return exports.defaultWindowState();
        }
        createBrowserWindow(config) {
            this.windowState = this.restoreWindowState(config.state);
            const options = {
                width: this.windowState.width,
                height: this.windowState.height,
                backgroundColor: "#ffffff",
                minWidth: CodeWindow.MIN_WIDTH,
                minHeight: CodeWindow.MIN_HEIGHT,
                show: true,
                title: 'sprout',
                webPreferences: {
                    // By default if Code is in the background, intervals and timeouts get throttled, so we
                    // want to enforce that Code stays in the foreground. This triggers a disable_hidden_
                    // flag that Electron provides via patch:
                    // https://github.com/electron/libchromiumcontent/blob/master/patches/common/chromium/disable_hidden.patch
                    backgroundThrottling: false,
                    nodeIntegration: true,
                    nodeIntegrationInWorker: RUN_TEXTMATE_IN_WORKER,
                    webviewTag: true
                }
            };
            this._win = new electron_1.BrowserWindow(options);
            this._win.loadURL('https://www.baidu.com');
            this._id = this._win.id;
            this._lastFocusTime = Date.now();
        }
        dispose() {
            super.dispose();
            this._win = null;
        }
    }
    CodeWindow.MIN_WIDTH = 200;
    CodeWindow.MIN_HEIGHT = 120;
    CodeWindow.MAX_URL_LENGTH = 2 * 1024 * 1024;
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeWindow.prototype, "restoreWindowState", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeWindow.prototype, "createBrowserWindow", null);
    exports.CodeWindow = CodeWindow;
});
