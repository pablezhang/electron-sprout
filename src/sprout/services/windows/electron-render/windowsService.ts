/*
 * @Author: pikun
 * @Date: 2019-12-08 11:19:02
 * @LastEditTime: 2019-12-08 11:22:00
 * @Description:
 */
import { Event } from 'sprout/base/common/event';
import { IWindowsService, MessageBoxOptions, IMessageBoxResult, SaveDialogOptions, OpenDialogOptions, IDevToolsOptions } from 'sprout/services/windows/common/windows';
import { IChannel } from 'sprout/base/parts/ipc/common/ipc';
import { IMainProcessService } from 'sprout/services/ipc/electron-render/mainProcessService';
import { ParsedArgs } from 'sprout/services/environment/common/environment';
import { FuncRunningLog } from 'sprout/base/utils/log';

export class WindowsService implements IWindowsService {
	_serviceBrand: undefined;

	private channel: IChannel;

	get onWindowOpen(): Event<number> { return this.channel.listen('onWindowOpen'); }
	get onWindowFocus(): Event<number> { return this.channel.listen('onWindowFocus'); }
	get onWindowBlur(): Event<number> { return this.channel.listen('onWindowBlur'); }
	get onWindowMaximize(): Event<number> { return this.channel.listen('onWindowMaximize'); }
	get onWindowUnmaximize(): Event<number> { return this.channel.listen('onWindowUnmaximize'); }

	constructor(@IMainProcessService mainProcessService: IMainProcessService) {
		this.channel = mainProcessService.getChannel('windows');
	}

	@FuncRunningLog()
	reloadWindow(windowId: number, args?: ParsedArgs): Promise<void> {
		return this.channel.call('reloadWindow', [windowId, args]);
	}

	openDevTools(windowId: number, options?: IDevToolsOptions): Promise<void> {
		return this.channel.call('openDevTools', [windowId, options]);
	}

	toggleDevTools(windowId: number): Promise<void> {
		return this.channel.call('toggleDevTools', windowId);
	}

}
