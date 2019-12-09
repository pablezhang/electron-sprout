/*
 * @Author: pikun
 * @Date: 2019-12-08 13:48:24
 * @LastEditTime: 2019-12-09 14:45:27
 * @Description:
 */
import { Disposable } from 'sprout/base/common/lifecycle';
import { ICodeWindow, IWindowState, WindowMode } from 'sprout/services/windows/electron-main/windows';
import { BrowserWindow } from 'electron';
import { FuncRunningLog } from 'sprout/base/utils/log';
import { ReadyState } from 'sprout/services/windows/common/windows';

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
	private _readyState: ReadyState;
	private _id: number;
	private _win: Electron.BrowserWindow;
	private _lastFocusTime: number;
	private windowState: IWindowState;

	private readonly whenReadyCallbacks: { (window: ICodeWindow): void }[];

	close(): void {
		if (this._win) {
			this._win.close();
		}
	}

	sendWhenReady(channel: string, ...args: any[]): void {
		if (this.isReady) {
			this.send(channel, ...args);
		} else {
			this.ready().then(() => this.send(channel, ...args));
		}
	}

	send(channel: string, ...args: any[]): void {
		if (this._win) {
			this._win.webContents.send(channel, ...args);
		}
	}

	setReady(): void {
		this._readyState = ReadyState.READY;

		// inform all waiting promises that we are ready now
		while (this.whenReadyCallbacks.length) {
			this.whenReadyCallbacks.pop()!(this);
		}
	}

	ready(): Promise<ICodeWindow> {
		return new Promise<ICodeWindow>(resolve => {
			if (this.isReady) {
				return resolve(this);
			}

			// otherwise keep and call later when we are ready
			this.whenReadyCallbacks.push(resolve);
		});
	}

	get isReady(): boolean {
		return this._readyState === ReadyState.READY;
	}

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
		this.whenReadyCallbacks = [];

		// create browser window
		this.createBrowserWindow(config);

	}

	@FuncRunningLog
	private restoreWindowState(state?: IWindowState): IWindowState {
		// TODO: @pikun
		return defaultWindowState();
	}

	@FuncRunningLog
	private createBrowserWindow(config: IWindowCreationOptions): void {
		this.windowState = this.restoreWindowState(config.state);

		const options: Electron.BrowserWindowConstructorOptions = {
			width: this.windowState.width,
			height: this.windowState.height,
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
