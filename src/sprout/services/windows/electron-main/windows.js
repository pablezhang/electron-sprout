define(["require", "exports", "sprout/instantiation/instantiation"], function (require, exports, instantiation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowMode;
    (function (WindowMode) {
        WindowMode[WindowMode["Maximized"] = 0] = "Maximized";
        WindowMode[WindowMode["Normal"] = 1] = "Normal";
        WindowMode[WindowMode["Minimized"] = 2] = "Minimized";
        WindowMode[WindowMode["Fullscreen"] = 3] = "Fullscreen";
    })(WindowMode = exports.WindowMode || (exports.WindowMode = {}));
    exports.IWindowsMainService = instantiation_1.createDecorator('windowsMainService');
});
