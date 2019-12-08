define(["require", "exports", "tslib", "sprout/base/common/event", "sprout/base/common/lifecycle", "sprout/services/lifecycle/common/lifecycle", "sprout/instantiation/instantiation", "sprout/windows/window", "sprout/base/utils/log"], function (require, exports, tslib_1, event_1, lifecycle_1, lifecycle_2, instantiation_1, window_1, log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowError;
    (function (WindowError) {
        WindowError[WindowError["UNRESPONSIVE"] = 1] = "UNRESPONSIVE";
        WindowError[WindowError["CRASHED"] = 2] = "CRASHED";
    })(WindowError || (WindowError = {}));
    let WindowsManager = class WindowsManager extends lifecycle_1.Disposable {
        constructor(machineId, lifecycleService, instantiationService) {
            super();
            this.machineId = machineId;
            this.lifecycleService = lifecycleService;
            this.instantiationService = instantiationService;
            this._onWindowReady = this._register(new event_1.Emitter());
            this.onWindowReady = this._onWindowReady.event;
            this._onWindowClose = this._register(new event_1.Emitter());
            this.onWindowClose = this._onWindowClose.event;
            this._onWindowLoad = this._register(new event_1.Emitter());
            this.onWindowLoad = this._onWindowLoad.event;
            this.lifecycleService.when(2 /* Ready */).then(() => this.registerListeners());
        }
        registerListeners() {
            //TODO: @pikun
        }
        getWindowById(windowId) {
            const res = WindowsManager.WINDOWS.filter(window => window.id === windowId);
            if (res && res.length === 1) {
                return res[0];
            }
            return undefined;
        }
        async reload(win, cli) {
            //TODO: @pikun
            return Promise.resolve();
        }
        open(openConfig) {
            const window = this.instantiationService.createInstance(window_1.CodeWindow, {});
            WindowsManager.WINDOWS.push(window);
            // TODO: @pikun
            return [window];
        }
    };
    WindowsManager.windowsStateStorageKey = 'windowsState';
    WindowsManager.WINDOWS = [];
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], WindowsManager.prototype, "open", null);
    WindowsManager = tslib_1.__decorate([
        tslib_1.__param(1, lifecycle_2.ILifecycleService),
        tslib_1.__param(2, instantiation_1.IInstantiationService)
    ], WindowsManager);
    exports.WindowsManager = WindowsManager;
});
