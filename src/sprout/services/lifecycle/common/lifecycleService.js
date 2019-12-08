define(["require", "exports", "sprout/base/common/event", "sprout/base/common/async", "sprout/base/common/lifecycle"], function (require, exports, event_1, async_1, lifecycle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AbstractLifecycleService extends lifecycle_1.Disposable {
        constructor() {
            super();
            this._onBeforeShutdown = this._register(new event_1.Emitter());
            this.onBeforeShutdown = this._onBeforeShutdown.event;
            this._onWillShutdown = this._register(new event_1.Emitter());
            this.onWillShutdown = this._onWillShutdown.event;
            this._onShutdown = this._register(new event_1.Emitter());
            this.onShutdown = this._onShutdown.event;
            this._phase = 1 /* Starting */;
            this.phaseWhen = new Map();
        }
        get startupKind() { return this._startupKind; }
        get phase() { return this._phase; }
        set phase(value) {
            if (value < this.phase) {
                throw new Error('Lifecycle cannot go backwards');
            }
            if (this._phase === value) {
                return;
            }
            this._phase = value;
            const barrier = this.phaseWhen.get(this._phase);
            if (barrier) {
                barrier.open();
                this.phaseWhen.delete(this._phase);
            }
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
    exports.AbstractLifecycleService = AbstractLifecycleService;
});
