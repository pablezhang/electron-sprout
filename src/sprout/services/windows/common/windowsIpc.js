define(["require", "exports", "sprout/base/common/event"], function (require, exports, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WindowsChannel {
        constructor(service) {
            this.service = service;
            this.onWindowOpen = event_1.Event.buffer(service.onWindowOpen, true);
            this.onWindowBlur = event_1.Event.buffer(service.onWindowBlur, true);
            this.onWindowMaximize = event_1.Event.buffer(service.onWindowMaximize, true);
            this.onWindowUnmaximize = event_1.Event.buffer(service.onWindowUnmaximize, true);
        }
        listen(_, event) {
            switch (event) {
                case 'onWindowOpen': return this.onWindowOpen;
                case 'onWindowFocus': return this.onWindowFocus;
                case 'onWindowBlur': return this.onWindowBlur;
                case 'onWindowMaximize': return this.onWindowMaximize;
                case 'onWindowUnmaximize': return this.onWindowUnmaximize;
            }
            throw new Error(`Event not found: ${event}`);
        }
        call(_, command, arg) {
            switch (command) {
                case 'reloadWindow': return this.service.reloadWindow(arg[0], arg[1]);
            }
        }
    }
    exports.WindowsChannel = WindowsChannel;
});
