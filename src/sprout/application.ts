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
export class Application extends Disposable {
	private windowsMainService: IWindowsMainService | undefined;
	constructor(
		private readonly mainIpcServer: Server,
		private readonly userEnv: IProcessEnvironment,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.registerListeners();
	}

	private registerListeners(): void {
		//TODO: @pikun
	}

	@FuncRunningLog
	async startup(): Promise<void> {
		// Create Electron IPC Servers
		const electronIpcServer = new ElectronIPCServer();
		const appInstantiationService = await this.createServices();
		const windows = appInstantiationService.invokeFunction(accessor => this.openFirstWindow(accessor, electronIpcServer));
	}

	@FuncRunningLog
	private async createServices(): Promise<IInstantiationService> {
		const services = new ServiceCollection();
		//TODO: @pikun
		const machineId = '12';
		services.set(IWindowsMainService, new SyncDescriptor(WindowsManager, [machineId]));
		services.set(IWindowsService, new SyncDescriptor(WindowsService))
		return this.instantiationService.createChild(services);
	}

	@FuncRunningLog
	private openFirstWindow(accessor: ServicesAccessor, electronIpcServer: ElectronIPCServer): ICodeWindow[] {
		const windowsService = accessor.get(IWindowsService);
		const windowsChannel = new WindowsChannel(windowsService);
		electronIpcServer.registerChannel('windows', windowsChannel);

		const windowsMainService = this.windowsMainService = accessor.get(IWindowsMainService);
		return windowsMainService.open({});
	}

}
