define(["require", "exports", "tslib", "sprout/base/common/decorator", "electron", "upath"], function (require, exports, tslib_1, decorator_1, electron_1, upath_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EnvironmentService {
        constructor(_args, _execPath) {
            this._args = _args;
            this._execPath = _execPath;
        }
        get args() { return this._args; }
        get userDataPath() {
            // TODO: @pikun 当用户改变安装目录的时候，我们可能需要调整此目录？
            return upath_1.default.normalizeSafe(electron_1.app.getPath('userdata'));
        }
        // TODO: @pikun 当用户改变安装目录的时候，我们可能需要调整此目录？
        get appRoot() { return upath_1.default.normalize(electron_1.app.getAppPath()); }
        get execPath() { return this._execPath; }
    }
    tslib_1.__decorate([
        decorator_1.memoize
    ], EnvironmentService.prototype, "args", null);
    tslib_1.__decorate([
        decorator_1.memoize
    ], EnvironmentService.prototype, "userDataPath", null);
    tslib_1.__decorate([
        decorator_1.memoize
    ], EnvironmentService.prototype, "appRoot", null);
    exports.EnvironmentService = EnvironmentService;
});
