/*
 * @Author: pikun
 * @Date: 2019-12-04 20:32:36
 * @LastEditTime: 2019-12-08 16:00:08
 * @Description:
 */
import {
  IWindowState as ISingleWindowState, IWindowsMainService, ICodeWindow, IOpenConfiguration,
} from 'sprout/services/windows/electron-main/windows';
import { Emitter, Event as CommonEvent } from 'sprout/base/common/event';
import { Disposable } from 'sprout/base/common/lifecycle';
import { ILifecycleService, LifecyclePhase } from 'sprout/services/lifecycle/common/lifecycle';
import { ParsedArgs } from 'sprout/services/environment/common/environment';
import { IInstantiationService } from 'sprout/instantiation/instantiation';
import { CodeWindow } from 'sprout/windows/window';
import { FuncRunningLog } from 'sprout/base/utils/log';

const enum WindowError {
	UNRESPONSIVE = 1,
	CRASHED = 2
}

export interface IWindowState {
	uiState: ISingleWindowState;
}

export interface IWindowsState {
	lastActiveWindow?: IWindowState;
	lastPluginDevelopmentHostWindow?: IWindowState;
	openedWindows: IWindowState[];
}

interface INewWindowState extends ISingleWindowState {
	hasDefaultState?: boolean;
}

interface IOpenBrowserWindowOptions {
}

export class WindowsManager extends Disposable implements IWindowsMainService {
	_serviceBrand: undefined;
	private static readonly windowsStateStorageKey = 'windowsState';
	private static readonly WINDOWS: ICodeWindow[] = [];

	private readonly windowsState: IWindowsState;
	private lastClosedWindowState?: IWindowState;

	private readonly _onWindowReady = this._register(new Emitter<ICodeWindow>());
	readonly onWindowReady: CommonEvent<ICodeWindow> = this._onWindowReady.event;

	private readonly _onWindowClose = this._register(new Emitter<number>());
	readonly onWindowClose: CommonEvent<number> = this._onWindowClose.event;

	private readonly _onWindowLoad = this._register(new Emitter<number>());
	readonly onWindowLoad: CommonEvent<number> = this._onWindowLoad.event;

	constructor(
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
		) {
		super();
		this.lifecycleService.when(LifecyclePhase.Ready).then(() => this.registerListeners());
	}

	private registerListeners(): void {
		//TODO: @pikun
	}

	getWindowById(windowId: number): ICodeWindow | undefined {
		const res = WindowsManager.WINDOWS.filter(window => window.id === windowId);
		if (res && res.length === 1) {
			return res[0];
		}

		return undefined;
	}

	async reload(win: ICodeWindow, cli?: ParsedArgs): Promise<void> {
		//TODO: @pikun
		return Promise.resolve();
	}

	@FuncRunningLog()
	open(openConfig: IOpenConfiguration): ICodeWindow[] {
		const window = this.instantiationService.createInstance(CodeWindow, {});
		WindowsManager.WINDOWS.push(window);
		// TODO: @pikun
		return [window];
	}
}
