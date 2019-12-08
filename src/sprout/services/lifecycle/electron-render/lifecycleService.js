define(["require", "exports", "sprout/services/lifecycle/common/lifecycleService", "sprout/services/lifecycle/common/lifecycle", "electron", "sprout/constants/ipcEvent"], function (require, exports, lifecycleService_1, lifecycle_1, electron_1, ipcEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LifecycleService extends lifecycleService_1.AbstractLifecycleService {
        constructor() {
            super();
            this._startupKind = this.resolveStartupKind();
            this.registerListeners();
        }
        registerListeners() {
            // TODO: @pikun use windowservice to get windowId
            const windowId = '1';
            electron_1.ipcRenderer.on(ipcEvent_1.IPC_EVENT.ON_BEFORE_UNLOAD, (_event, reply) => {
                this.handleBeforeShutdown(reply.reason).then(veto => {
                    if (veto) {
                        electron_1.ipcRenderer.send(reply.cancelChannel, windowId);
                    }
                    else {
                        this.shutdownReason = reply.reason;
                        electron_1.ipcRenderer.send(reply.okChannel, windowId);
                    }
                });
            });
        }
        resolveStartupKind() {
            // TODO: @pikun
            return 1 /* NewWindow */;
        }
        handleBeforeShutdown(reason) {
            const vetos = [];
            this._onBeforeShutdown.fire({
                veto(value) {
                    vetos.push(value);
                },
                reason
            });
            return lifecycle_1.handleVetos(vetos, err => {
                //TODO: @pikun
                console.error('err:', err);
            });
        }
        async handleWillShutdown(reason) {
            const joiners = [];
            this._onWillShutdown.fire({
                join(promise) {
                    if (promise) {
                        joiners.push(promise);
                    }
                },
                reason
            });
            try {
                await Promise.all(joiners);
            }
            catch (error) {
                //TODO: @pikun
                console.error('err:', error);
            }
        }
    }
    exports.LifecycleService = LifecycleService;
    LifecycleService.LAST_SHUTDOWN_REASON_KEY = 'lifecyle.lastShutdownReason';
});
