/*
 * @Author: pikun
 * @Date: 2019-12-08 11:22:31
 * @LastEditTime: 2019-12-08 15:54:39
 * @Description:
 */
import { IWindowsService } from 'sprout/services/windows/common/windows';
import { Disposable, DisposableStore } from 'sprout/base/common/lifecycle';
import { Event } from 'sprout/base/common/event';
import { app } from 'electron';
import { ParsedArgs } from 'sprout/services/environment/common/environment';
import { IWindowsMainService } from 'sprout/services/windows/electron-main/windows';
import { FuncRunningLog } from 'sprout/base/utils/log';
export class WindowsService extends Disposable implements IWindowsService {
	_serviceBrand: undefined;

	private readonly disposables = this._register(new DisposableStore());

	private _activeWindowId: number | undefined;

	readonly onWindowOpen: Event<number> = Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-created', (_, w: Electron.BrowserWindow) => w.id), id => !!this.windowsMainService.getWindowById(id));
	readonly onWindowBlur: Event<number> = Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-blur', (_, w: Electron.BrowserWindow) => w.id), id => !!this.windowsMainService.getWindowById(id));
	readonly onWindowMaximize: Event<number> = Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-maximize', (_, w: Electron.BrowserWindow) => w.id), id => !!this.windowsMainService.getWindowById(id));
	readonly onWindowUnmaximize: Event<number> = Event.filter(Event.fromNodeEventEmitter(app, 'browser-window-unmaximize', (_, w: Electron.BrowserWindow) => w.id), id => !!this.windowsMainService.getWindowById(id));

	constructor(
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService
	) {
		super();
	}

	async reloadWindow(windowId: number, args: ParsedArgs): Promise<void> {
		// TODO: @pikun
		return Promise.resolve();
	}

}
