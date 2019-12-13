import { Disposable } from 'sprout/base/common/lifecycle';
import { IWindowConfiguration } from 'sprout/services/windows/common/windows';
import { ServiceCollection } from 'sprout/instantiation/serviceCollection';
import { IInstantiationService } from 'sprout/instantiation/instantiation';
import { getSingletonServiceDescriptors } from 'sprout/instantiation/extensions';
import { InstantiationService } from 'sprout/instantiation/instantiationService';
import { LifecyclePhase, ILifecycleService } from 'sprout/services/lifecycle/common/lifecycle';


class MainWindowRender extends Disposable {

	private serviceCollection: ServiceCollection;
	private _instantiationService: IInstantiationService;
	constructor(configuration: IWindowConfiguration) {
		super();
	}

	async open(): Promise<void> {
		this._instantiationService = this.initServices();
		// require('@babel/register')(require('sprout/windows/main-window/electron-render/babel-entry-config'));
		// require('sprout/windows/main-window/electron-render');
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
		const instantiationService = new InstantiationService(this.serviceCollection, true);
		instantiationService.invokeFunction(accessor => {
			const lifecycleService = accessor.get(ILifecycleService);
			// Signal to lifecycle that services are set
			lifecycleService.phase = LifecyclePhase.Ready;
		});
		return instantiationService;
	}
}


let mainWindowRender: MainWindowRender;


export function main(configuration: IWindowConfiguration, hide: boolean = false): Promise<void> {
	if (!mainWindowRender) {
		mainWindowRender = new MainWindowRender(configuration);
	}
	return mainWindowRender.open();
}

export function injectInstance<T>(ctor: any) {
	return function (target: any, propertyKey: string) {
		target[propertyKey] = mainWindowRender.instantiationService.createInstance(ctor);
		return target[propertyKey];
	}
}
