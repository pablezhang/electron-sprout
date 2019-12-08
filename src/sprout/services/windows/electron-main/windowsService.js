define(["require", "exports", "tslib", "sprout/base/common/lifecycle", "sprout/base/common/event", "electron", "sprout/services/windows/electron-main/windows"], function (require, exports, tslib_1, lifecycle_1, event_1, electron_1, windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let WindowsService = class WindowsService extends lifecycle_1.Disposable {
        constructor(windowsMainService) {
            super();
            this.windowsMainService = windowsMainService;
            this.disposables = this._register(new lifecycle_1.DisposableStore());
            this.onWindowOpen = event_1.Event.filter(event_1.Event.fromNodeEventEmitter(electron_1.app, 'browser-window-created', (_, w) => w.id), id => !!this.windowsMainService.getWindowById(id));
            this.onWindowBlur = event_1.Event.filter(event_1.Event.fromNodeEventEmitter(electron_1.app, 'browser-window-blur', (_, w) => w.id), id => !!this.windowsMainService.getWindowById(id));
            this.onWindowMaximize = event_1.Event.filter(event_1.Event.fromNodeEventEmitter(electron_1.app, 'browser-window-maximize', (_, w) => w.id), id => !!this.windowsMainService.getWindowById(id));
            this.onWindowUnmaximize = event_1.Event.filter(event_1.Event.fromNodeEventEmitter(electron_1.app, 'browser-window-unmaximize', (_, w) => w.id), id => !!this.windowsMainService.getWindowById(id));
        }
        async reloadWindow(windowId, args) {
            // TODO: @pikun
            return Promise.resolve();
        }
    };
    WindowsService = tslib_1.__decorate([
        tslib_1.__param(0, windows_1.IWindowsMainService)
    ], WindowsService);
    exports.WindowsService = WindowsService;
});
