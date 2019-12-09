define(["require", "exports", "tslib", "sprout/instantiation/serviceCollection", "sprout/instantiation/instantiationService", "sprout/base/parts/ipc/node/ipc.net", "electron", "sprout/base/common/platform", "path", "sprout/constants/processEnv", "sprout/application", "sprout/base/utils/log", "sprout/instantiation/descriptors", "sprout/services/lifecycle/electron-main/lifecycleService", "sprout/services/lifecycle/common/lifecycle"], function (require, exports, tslib_1, serviceCollection_1, instantiationService_1, ipc_net_1, electron_1, platform, path, processEnv_1, application_1, log_1, descriptors_1, lifecycleService_1, lifecycle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ExpectedError extends Error {
        constructor() {
            super(...arguments);
            this.isExpected = true;
        }
    }
    class CodeMain {
        main() {
            try {
                this.startup();
            }
            catch (error) {
                log_1.info('main-start-error:', error);
            }
        }
        async startup() {
            const [instantiationService, instanceEnvironment] = this.createServices();
            try {
                await instantiationService.invokeFunction(async (accessor) => {
                    log_1.info('run doStartup');
                    const mainIpcServer = await this.doStartup();
                    log_1.info('server start success');
                    return instantiationService.createInstance(application_1.Application, mainIpcServer, instanceEnvironment).startup();
                });
            }
            catch (error) {
                log_1.info('startup:', error);
                instantiationService.invokeFunction(this.quit, error);
            }
        }
        async doStartup() {
            let server;
            try {
                // 创建成功，则表示第一次创建
                //TODO: pikun mainIPCHandle put into environment service
                const mainIPCHandle = path.join(electron_1.app.getPath('userData'), 'version_mian13.sock');
                console.log('mainIPCHandle:', mainIPCHandle);
                server = await ipc_net_1.serve(mainIPCHandle);
            }
            catch (error) {
                //TODO: @pikun handle error
                log_1.info('doStartup:', error);
            }
            if (platform.isMacintosh) {
                electron_1.app.dock.show();
            }
            process.env[processEnv_1.PROCESS_ENV.SPROUT_PID] = String(process.pid);
            return server;
        }
        createServices() {
            const services = new serviceCollection_1.ServiceCollection();
            const instanceEnvironment = this.patchEnvironment();
            services.set(lifecycle_1.ILifecycleService, new descriptors_1.SyncDescriptor(lifecycleService_1.LifecycleService));
            return [new instantiationService_1.InstantiationService(services, true), instanceEnvironment];
        }
        patchEnvironment() {
            // TODO: @pikun add environment env to result
            return process.env;
        }
        quit(accessor, reason) {
            //TODO: @pikun
        }
    }
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeMain.prototype, "main", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeMain.prototype, "startup", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeMain.prototype, "doStartup", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeMain.prototype, "createServices", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeMain.prototype, "patchEnvironment", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], CodeMain.prototype, "quit", null);
    // Main Startup
    const code = new CodeMain();
    code.main();
});
