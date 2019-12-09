define(["require", "exports", "electron", "sprout/base/common/event", "sprout/instantiation/instantiation", "sprout/base/common/lifecycle", "sprout/base/common/async"], function (require, exports, electron_1, event_1, instantiation_1, lifecycle_1, async_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ILifecycleService = instantiation_1.createDecorator('lifecycleService');
    var UnloadReason;
    (function (UnloadReason) {
        UnloadReason[UnloadReason["CLOSE"] = 1] = "CLOSE";
        UnloadReason[UnloadReason["QUIT"] = 2] = "QUIT";
        UnloadReason[UnloadReason["RELOAD"] = 3] = "RELOAD";
        UnloadReason[UnloadReason["LOAD"] = 4] = "LOAD";
    })(UnloadReason = exports.UnloadReason || (exports.UnloadReason = {}));
    var LifecycleMainPhase;
    (function (LifecycleMainPhase) {
        /**
         * The first phase signals that we are about to startup.
         */
        LifecycleMainPhase[LifecycleMainPhase["Starting"] = 1] = "Starting";
        /**
         * Services are ready and first window is about to open.
         */
        LifecycleMainPhase[LifecycleMainPhase["Ready"] = 2] = "Ready";
        /**
         * This phase signals a point in time after the window has opened
         * and is typically the best place to do work that is not required
         * for the window to open.
         */
        LifecycleMainPhase[LifecycleMainPhase["AfterWindowOpen"] = 3] = "AfterWindowOpen";
    })(LifecycleMainPhase = exports.LifecycleMainPhase || (exports.LifecycleMainPhase = {}));
    class LifecycleService extends lifecycle_1.Disposable {
        constructor() {
            super();
            this._wasRestarted = false;
            this._quitRequested = false;
            this._phase = 1 /* Starting */;
            this._onBeforeShutdown = this._register(new event_1.Emitter());
            this.onBeforeShutdown = this._onBeforeShutdown.event;
            this._onWillShutdown = this._register(new event_1.Emitter());
            this.onWillShutdown = this._onWillShutdown.event;
            this._onBeforeWindowClose = this._register(new event_1.Emitter());
            this.onBeforeWindowClose = this._onBeforeWindowClose.event;
            this._onBeforeWindowUnload = this._register(new event_1.Emitter());
            this.onBeforeWindowUnload = this._onBeforeWindowUnload.event;
            this.phaseWhen = new Map();
            this.when(2 /* Ready */).then(() => this.registerListeners());
        }
        get wasRestarted() { return this._wasRestarted; }
        get quitRequested() { return this._quitRequested; }
        get phase() { return this._phase; }
        registerListeners() {
            electron_1.app.addListener('before-quit', () => this.beforeQuitListener);
            electron_1.app.addListener('window-all-closed', this.windowAllClosedListener);
        }
        windowAllClosedListener() {
            electron_1.app.quit();
        }
        beforeQuitListener() {
            if (this._quitRequested) {
                return;
            }
            this._quitRequested = true;
            this._onBeforeShutdown.fire();
        }
        willQuitListener(e) {
            e.preventDefault();
            electron_1.app.removeListener('before-quit', this.beforeQuitListener);
            electron_1.app.removeListener('window-all-closed', this.windowAllClosedListener);
            electron_1.app.quit();
        }
        async unload(window, reason) {
            throw new Error('Method not implemented.');
        }
        relaunch(options) {
            throw new Error('Method not implemented.');
        }
        quit(fromUpdate) {
            throw new Error('Method not implemented.');
        }
        kill(code) {
            throw new Error('Method not implemented.');
        }
        async when(phase) {
            if (phase <= this._phase) {
                return;
            }
            let barrier = this.phaseWhen.get(phase);
            if (!barrier) {
                barrier = new async_1.Barrier();
                this.phaseWhen.set(phase, barrier);
            }
            await barrier.wait();
        }
    }
    exports.LifecycleService = LifecycleService;
});
