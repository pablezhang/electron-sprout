/*
 * @Author: pikun
 * @Date: 2019-12-04 20:28:40
 * @LastEditTime: 2019-12-09 09:26:08
 * @Description: 主进程入口
 */
import { ServiceCollection } from 'sprout/instantiation/serviceCollection';
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
				info('run doStartup');
				const mainIpcServer = await this.doStartup();
				info('server start success');
				return instantiationService.createInstance(Application, mainIpcServer, instanceEnvironment).startup();
			})
		} catch (error) {
			info('startup:', error);
			instantiationService.invokeFunction(this.quit, error);
		}
	}

	@FuncRunningLog
	private async doStartup(): Promise<Server> {
		let server: Server;
		try {
			// 创建成功，则表示第一次创建
			//TODO: pikun mainIPCHandle put into environment service
			const mainIPCHandle = path.join(app.getPath('userData'), 'version_mian13.sock');
			console.log('mainIPCHandle:', mainIPCHandle);
			server = await serve(mainIPCHandle);
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
		const instanceEnvironment = this.patchEnvironment();
		services.set(ILifecycleService, new SyncDescriptor(LifecycleService));
		return [new InstantiationService(services, true), instanceEnvironment];
	}

	@FuncRunningLog
	private patchEnvironment(): typeof process.env {
		// TODO: @pikun add environment env to result
		return process.env;
	}

	@FuncRunningLog
	private quit(accessor: ServicesAccessor, reason?: ExpectedError | Error): void {
		//TODO: @pikun
	}
}


// Main Startup
const code = new CodeMain();
code.main();
