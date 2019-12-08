define(["require", "exports", "tslib", "sprout/services/ipc/electron-render/mainProcessService"], function (require, exports, tslib_1, mainProcessService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let WindowsService = class WindowsService {
        constructor(mainProcessService) {
            this.channel = mainProcessService.getChannel('windows');
        }
        get onWindowOpen() { return this.channel.listen('onWindowOpen'); }
        get onWindowFocus() { return this.channel.listen('onWindowFocus'); }
        get onWindowBlur() { return this.channel.listen('onWindowBlur'); }
        get onWindowMaximize() { return this.channel.listen('onWindowMaximize'); }
        get onWindowUnmaximize() { return this.channel.listen('onWindowUnmaximize'); }
        reloadWindow(windowId, args) {
            return this.channel.call('reloadWindow', [windowId, args]);
        }
        openDevTools(windowId, options) {
            return this.channel.call('openDevTools', [windowId, options]);
        }
        toggleDevTools(windowId) {
            return this.channel.call('toggleDevTools', windowId);
        }
    };
    WindowsService = tslib_1.__decorate([
        tslib_1.__param(0, mainProcessService_1.IMainProcessService)
    ], WindowsService);
    exports.WindowsService = WindowsService;
});
