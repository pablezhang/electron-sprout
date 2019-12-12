/*
 * @Author: pikun
 * @Date: 2019-12-08 12:34:34
 * @LastEditTime: 2019-12-08 22:47:03
 * @Description:
 */
import { Disposable } from 'sprout/base/common/lifecycle';
import { IWindowsMainService, ICodeWindow } from 'sprout/services/windows/electron-main/windows';
import { Server as ElectronIPCServer } from 'sprout/base/parts/ipc/electron-main/ipc.electron-main';
import { Server, connect } from 'sprout/base/parts/ipc/node/ipc.net';
import { IProcessEnvironment } from 'sprout/base/common/platform';
import { IInstantiationService, ServicesAccessor } from 'sprout/instantiation/instantiation';
import { ServiceCollection } from 'sprout/instantiation/serviceCollection';
import { SyncDescriptor } from 'sprout/instantiation/descriptors';
import { WindowsManager } from 'sprout/windows/windowsManager';
import { IWindowsService } from 'sprout/services/windows/common/windows';
import { WindowsChannel } from 'sprout/services/windows/common/windowsIpc';
import { FuncRunningLog } from 'sprout/base/utils/log';
import { WindowsService } from 'sprout/services/windows/electron-main/windowsService';
import { ILifecycleService } from 'sprout/services/lifecycle/common/lifecycle';
import { LifecycleMainPhase } from 'sprout/services/lifecycle/electron-main/lifecycleService';
export class Application extends Disposable {
	private windowsMainService: IWindowsMainService | undefined;
	constructor(
		private readonly mainIpcServer: Server,
		private readonly userEnv: IProcessEnvironment,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILifecycleService private lifecycleService: ILifecycleService
	) {
		super();
		this.registerListeners();
	}

	private registerListeners(): void {
		//TODO: @pikun
	}

	@FuncRunningLog()
	async startup(): Promise<void> {
		// Create Electron IPC Servers
		const electronIpcServer = new ElectronIPCServer();
		const appInstantiationService = await this.createServices();
		const windows = appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor, electronIpcServer));
	}

	@FuncRunningLog()
	private async createServices(): Promise<IInstantiationService> {
		const services = new ServiceCollection();
		//TODO: @pikun
		services.set(IWindowsMainService, new SyncDescriptor(WindowsManager));
		services.set(IWindowsService, new SyncDescriptor(WindowsService))
		return this.instantiationService.createChild(services);
	}

	@FuncRunningLog()
	private openFirstWindow(accessor: ServicesAccessor, electronIpcServer: ElectronIPCServer): ICodeWindow[] {
		const windowsService = accessor.get(IWindowsService);
		const windowsChannel = new WindowsChannel(windowsService);
		electronIpcServer.registerChannel('windows', windowsChannel);

		// Signal phase: ready (services set)
		// @ts-ignore
		this.lifecycleService.phase = LifecycleMainPhase.Ready;

		const windowsMainService = this.windowsMainService = accessor.get(IWindowsMainService);
		return windowsMainService.open({});
	}

}
