define(["require", "exports", "sprout/instantiation/instantiation"], function (require, exports, instantiation_1) {
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
});
