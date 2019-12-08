define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EnvironmentChannel {
        constructor(service) {
            this.service = service;
        }
        listen(_, event) {
            throw new Error(`no implements for this`);
        }
        call(_, command, arg) {
            //TODO: @pikun
            return Promise.resolve();
        }
    }
    exports.EnvironmentChannel = EnvironmentChannel;
});
