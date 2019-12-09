/*
 * @Author: pikun
 * @Date: 2019-12-04 20:28:40
 * @LastEditTime: 2019-12-09 11:32:47
 * @Description: 主进程入口
 */
import { ServiceCollection } from 'sprout/instantiation/serviceCollection';
import { assign } from 'sprout/base/common/objects';
import { once } from 'sprout/base/common/functional';
import { InstantiationService } from 'sprout/instantiation/instantiationService';
import { IInstantiationService, ServicesAccessor } from 'sprout/instantiation/instantiation';
import { Server, serve } from 'sprout/base/parts/ipc/node/ipc.net';
import { app } from 'electron';
import * as platform from 'sprout/base/common/platform';
import * as path from 'path';
import { PROCESS_ENV } from 'sprout/constants/processEnv';
import { Application } from 'sprout/application';
import { FuncRunningLog, info } from 'sprout/base/utils/log';
import { SyncDescriptor } from 'sprout/instantiation/descriptors';
import { LifecycleService } from 'sprout/services/lifecycle/electron-main/lifecycleService';
import { ILifecycleService } from 'sprout/services/lifecycle/common/lifecycle';
import { EnvironmentService } from 'sprout/services/environment/electron-main/environmentService';
import { IEnvironmentService } from 'sprout/services/environment/common/environment';
class ExpectedError extends Error {
	readonly isExpected = true;
}

class CodeMain {

	@FuncRunningLog
	main(): void {
		try {
			this.startup();
		} catch (error) {
			info('main-start-error:', error);
		}

	}

	@FuncRunningLog
	private async startup(): Promise<void> {
		const [instantiationService, instanceEnvironment] = this.createServices();

		try {
			await instantiationService.invokeFunction(async accessor => {
				const environmentService = accessor.get(IEnvironmentService);
				const lifecycleService = accessor.get(ILifecycleService);

				info('run doStartup');
				const mainIpcServer = await this.doStartup(environmentService, lifecycleService);
				info('server start success');
				return instantiationService.createInstance(Application, mainIpcServer, instanceEnvironment).startup();
			})
		} catch (error) {
			info('startup:', error);
			instantiationService.invokeFunction(this.quit, error);
		}
	}

	@FuncRunningLog
	private async doStartup(environmentService: IEnvironmentService, lifecycleService: ILifecycleService): Promise<Server> {
		let server: Server;
		try {
			// 创建成功，则表示第一次创建(TCP服务)
			server = await serve(environmentService.mainIPCHandle);

			once(lifecycleService.onWillShutdown)(() => server.dispose());
		} catch (error) {
			//TODO: @pikun handle error
			info('doStartup:', error);
		}

	 if (platform.isMacintosh) {
		 app.dock.show();
	 }

	 process.env[PROCESS_ENV.SPROUT_PID] = String(process.pid);
	 return server;
	}

	@FuncRunningLog
	private createServices(): [IInstantiationService, typeof process.env] {
		const services = new ServiceCollection();
		// 环境服务
		const environmentService = new EnvironmentService(process.argv, process.execPath);
		const instanceEnvironment = this.patchEnvironment(environmentService);
		services.set(IEnvironmentService, environmentService);

		services.set(ILifecycleService, new SyncDescriptor(LifecycleService));
		return [new InstantiationService(services, true), instanceEnvironment];
	}

	@FuncRunningLog
	private patchEnvironment(environmentService: IEnvironmentService): typeof process.env {
		// TODO: @pikun add environment env to result
		const instanceEnvironment: typeof process.env = {
			SPROUT_IPC_HOOK: environmentService.mainIPCHandle,
		};

		assign(process.env, instanceEnvironment);
		return instanceEnvironment;
	}

	@FuncRunningLog
	private quit(accessor: ServicesAccessor, reason?: ExpectedError | Error): void {
		//TODO: @pikun
	}
}


// Main Startup
const code = new CodeMain();
code.main();
