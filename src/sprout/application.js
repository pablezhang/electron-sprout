define(["require", "exports", "tslib", "sprout/base/common/lifecycle", "sprout/services/windows/electron-main/windows", "sprout/base/parts/ipc/electron-main/ipc.electron-main", "sprout/instantiation/instantiation", "sprout/instantiation/serviceCollection", "sprout/instantiation/descriptors", "sprout/windows/windowsManager", "sprout/services/windows/common/windows", "sprout/services/windows/common/windowsIpc", "sprout/base/utils/log", "sprout/services/windows/electron-main/windowsService"], function (require, exports, tslib_1, lifecycle_1, windows_1, ipc_electron_main_1, instantiation_1, serviceCollection_1, descriptors_1, windowsManager_1, windows_2, windowsIpc_1, log_1, windowsService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Application = class Application extends lifecycle_1.Disposable {
        constructor(mainIpcServer, userEnv, instantiationService) {
            super();
            this.mainIpcServer = mainIpcServer;
            this.userEnv = userEnv;
            this.instantiationService = instantiationService;
            this.registerListeners();
        }
        registerListeners() {
            //TODO: @pikun
        }
        async startup() {
            // Create Electron IPC Servers
            const electronIpcServer = new ipc_electron_main_1.Server();
            const appInstantiationService = await this.createServices();
            const windows = appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor, electronIpcServer));
        }
        async createServices() {
            const services = new serviceCollection_1.ServiceCollection();
            //TODO: @pikun
            const machineId = '12';
            services.set(windows_1.IWindowsMainService, new descriptors_1.SyncDescriptor(windowsManager_1.WindowsManager, [machineId]));
            services.set(windows_2.IWindowsService, new descriptors_1.SyncDescriptor(windowsService_1.WindowsService));
            return this.instantiationService.createChild(services);
        }
        openFirstWindow(accessor, electronIpcServer) {
            const windowsService = accessor.get(windows_2.IWindowsService);
            const windowsChannel = new windowsIpc_1.WindowsChannel(windowsService);
            electronIpcServer.registerChannel('windows', windowsChannel);
            const windowsMainService = this.windowsMainService = accessor.get(windows_1.IWindowsMainService);
            return windowsMainService.open({});
        }
    };
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], Application.prototype, "startup", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], Application.prototype, "createServices", null);
    tslib_1.__decorate([
        log_1.FuncRunningLog
    ], Application.prototype, "openFirstWindow", null);
    Application = tslib_1.__decorate([
        tslib_1.__param(2, instantiation_1.IInstantiationService)
    ], Application);
    exports.Application = Application;
});
