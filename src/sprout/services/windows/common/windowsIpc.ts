/*
 * @Author: pikun
 * @Date: 2019-12-08 11:16:27
 * @LastEditTime: 2019-12-08 16:35:28
 * @Description:
 */
import { Event } from 'sprout/base/common/event';
import { IServerChannel } from 'sprout/base/parts/ipc/common/ipc';
import { IWindowsService } from 'sprout/services/windows/common/windows';
export class WindowsChannel implements IServerChannel {

	private readonly onWindowOpen: Event<number>;
	private readonly onWindowFocus: Event<number>;
	private readonly onWindowBlur: Event<number>;
	private readonly onWindowMaximize: Event<number>;
	private readonly onWindowUnmaximize: Event<number>;

	constructor(private readonly service: IWindowsService) {
		this.onWindowOpen = Event.buffer(service.onWindowOpen, true);
		this.onWindowBlur = Event.buffer(service.onWindowBlur, true);
		this.onWindowMaximize = Event.buffer(service.onWindowMaximize, true);
		this.onWindowUnmaximize = Event.buffer(service.onWindowUnmaximize, true);
	}

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onWindowOpen': return this.onWindowOpen;
			case 'onWindowFocus': return this.onWindowFocus;
			case 'onWindowBlur': return this.onWindowBlur;
			case 'onWindowMaximize': return this.onWindowMaximize;
			case 'onWindowUnmaximize': return this.onWindowUnmaximize;
		}

		throw new Error(`Event not found: ${event}`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'reloadWindow': return this.service.reloadWindow(arg[0], arg[1]);
		}
		throw new Error(`Event not found: ${command}`);
	}
}
