import { Disposable } from 'sprout/base/common/lifecycle';
import { IWindowConfiguration } from 'sprout/services/windows/common/windows';
import { ServiceCollection } from 'sprout/instantiation/serviceCollection';
import { IInstantiationService } from 'sprout/instantiation/instantiation';
import { getSingletonServiceDescriptors } from 'sprout/instantiation/extensions';
import { InstantiationService } from 'sprout/instantiation/instantiationService';
import { LifecyclePhase, ILifecycleService } from 'sprout/services/lifecycle/common/lifecycle';
import { FuncRunningLog } from 'sprout/base/utils/log';
import { MainProcessService, IMainProcessService } from 'sprout/services/ipc/electron-render/mainProcessService';


class MainWindowRender extends Disposable {

	private serviceCollection: ServiceCollection;
	private _instantiationService: IInstantiationService;
	constructor(configuration: IWindowConfiguration) {
		super();
	}

	@FuncRunningLog()
	async open(): Promise<void> {
		this._instantiationService = this.initServices();
	}

	get instantiationService(): IInstantiationService {
		return this._instantiationService;
	}


	private initServices(): IInstantiationService {
		this.serviceCollection = new ServiceCollection();
		// All Contributed Services
    const contributedServices = getSingletonServiceDescriptors();
    for (let [id, descriptor] of contributedServices) {
      this.serviceCollection.set(id, descriptor);
		}

		// Main Process
		const mainProcessService = this._register(new MainProcessService(1));
		this.serviceCollection.set(IMainProcessService, mainProcessService);

		const instantiationService = new InstantiationService(this.serviceCollection, true);
		instantiationService.invokeFunction(accessor => {
			const lifecycleService = accessor.get(ILifecycleService);
			// Signal to lifecycle that services are set
			lifecycleService.phase = LifecyclePhase.Ready;
		});
		return instantiationService;
	}
}

let mainWindowRender :MainWindowRender;

export function main(configuration: IWindowConfiguration): Promise<void> {
	mainWindowRender = new MainWindowRender(configuration);
	console.log('mainWindowRender:', mainWindowRender);
	return mainWindowRender.open();
}

export function autowired<T>(ctor: any) {
	console.log('ctor:', mainWindowRender);
	return function (target: any, propertyKey: string) {
		console.log('ctor111:', mainWindowRender);
		target[propertyKey] = mainWindowRender.instantiationService.createInstance(ctor);
		return target[propertyKey];
	}
}
