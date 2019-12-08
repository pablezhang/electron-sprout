
/*
 * @Author: pikun
 * @Date: 2019-12-08 11:27:10
 * @LastEditTime: 2019-12-08 15:52:54
 * @Description:
 */
import { createDecorator } from 'sprout/instantiation/instantiation';
import { Event } from 'sprout/base/common/event';
import { ParsedArgs } from 'sprout/services/environment/common/environment';
import { IWindowConfiguration } from 'sprout/services/windows/common/windows';
export interface IWindowState {
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	mode?: WindowMode;
	display?: number;
}

export const enum WindowMode {
	Maximized,
	Normal,
	Minimized, // not used anymore, but also cannot remove due to existing stored UI state (needs migration)
	Fullscreen
}



export interface ICodeWindow {
	readonly id: number;
	readonly win: Electron.BrowserWindow;

	readonly lastFocusTime: number;

	dispose(): void;
}

export const IWindowsMainService = createDecorator<IWindowsMainService>('windowsMainService');

export interface IWindowsCountChangedEvent {
	readonly oldCount: number;
	readonly newCount: number;
}

export interface IWindowsMainService {
	_serviceBrand: undefined;
	readonly onWindowReady: Event<ICodeWindow>;

	getWindowById(windowId: number): ICodeWindow | undefined;

	reload(win: ICodeWindow, cli?: ParsedArgs): void;
	open(openConfig: IOpenConfiguration): ICodeWindow[];
}


export interface IOpenConfiguration {
	readonly contextWindowId?: number;
}

export interface ISharedProcess {
	whenReady(): Promise<void>;
	toggle(): void;
}
