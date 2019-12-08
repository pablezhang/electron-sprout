
/*
 * @Author: pikun
 * @Date: 2019-12-07 21:32:07
 * @LastEditTime: 2019-12-08 16:03:12
 * @Description: 渲染进程和主进程服务通信
 */
import { IServerChannel } from 'sprout/base/parts/ipc/common/ipc';
import { Event } from 'sprout/base/common/event';
import { IEnvironmentService } from 'sprout/services/environment/common/environment';

export class EnvironmentChannel implements IServerChannel {
	constructor(private readonly service: IEnvironmentService) {

	}

	listen(_: unknown, event: string): Event<any> {
		throw new Error(`no implements for this`);
	}

	call(_: unknown, command: string, arg?: any): Promise<any> {
		//TODO: @pikun
		return Promise.resolve();
	}
}
