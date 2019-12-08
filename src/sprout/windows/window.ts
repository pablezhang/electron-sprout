/*
 * @Author: pikun
 * @Date: 2019-12-08 13:48:24
 * @LastEditTime: 2019-12-08 15:59:43
 * @Description:
 */
import { Disposable } from 'sprout/base/common/lifecycle';
import { ICodeWindow, IWindowState, WindowMode } from 'sprout/services/windows/electron-main/windows';
import { BrowserWindow } from 'electron';
import { FuncRunningLog } from 'sprout/base/utils/log';

export interface IWindowCreationOptions {
	state?: IWindowState;
	extensionDevelopmentPath?: string[];
	isExtensionTestHost?: boolean;
}

export const defaultWindowState = function (mode = WindowMode.Normal): IWindowState {
	return {
		width: 1276,
		height: 795,
		mode
	};
};

const RUN_TEXTMATE_IN_WORKER = false;
export class CodeWindow extends Disposable implements ICodeWindow {
	private static readonly MIN_WIDTH = 200;
	private static readonly MIN_HEIGHT = 120;
	private static readonly MAX_URL_LENGTH = 2 * 1024 * 1024;
	private hiddenTitleBarStyle: boolean;
	private _id: number;
	private _win: Electron.BrowserWindow;
	private _lastFocusTime: number;
	private windowState: IWindowState;

	get id(): number {
		return this._id;
	}

	get lastFocusTime(): number {
		return this._lastFocusTime;
	}

	get win(): Electron.BrowserWindow {
		return this._win;
	}

	constructor(
		config: IWindowCreationOptions,
	) {
		super();
		// create browser window
		this.createBrowserWindow(config);
	}

	@FuncRunningLog
	private createBrowserWindow(config: IWindowCreationOptions): void {
		const options: Electron.BrowserWindowConstructorOptions = {
			width: this.windowState.width,
			height: this.windowState.height,
			x: this.windowState.x,
			y: this.windowState.y,
			backgroundColor: "#ffffff",
			minWidth: CodeWindow.MIN_WIDTH,
			minHeight: CodeWindow.MIN_HEIGHT,
			show: true,
			title: 'sprout',
			webPreferences: {
				// By default if Code is in the background, intervals and timeouts get throttled, so we
				// want to enforce that Code stays in the foreground. This triggers a disable_hidden_
				// flag that Electron provides via patch:
				// https://github.com/electron/libchromiumcontent/blob/master/patches/common/chromium/disable_hidden.patch
				backgroundThrottling: false,
				nodeIntegration: true,
				nodeIntegrationInWorker: RUN_TEXTMATE_IN_WORKER,
				webviewTag: true
			}
		};

		this._win = new BrowserWindow(options);
		this._win.loadURL('https://www.baidu.com');
		this._id = this._win.id;
		this._lastFocusTime = Date.now();
	}

	dispose(): void {
		super.dispose();
		this._win = null;
	}
}
