/*
 * @Author: pikun
 * @Date: 2019-12-07 17:56:35
 * @LastEditTime: 2019-12-09 11:21:39
 * @Description:
 */
import { IEnvironmentService, ParsedArgs } from 'sprout/services/environment/common/environment';
import { memoize } from 'sprout/base/common/decorator';
import * as crypto from 'crypto';
import path from 'path';
import { isWindows } from 'sprout/base/common/platform';
import { app } from 'electron';
import upath from 'upath';

export const IPC_HANDLE_TYPE = {
	MAIN: 'main',
	RENDER: 'render'
}

function getIPCHandle(userDataPath: string, type: string): string {
	return isWindows ? getWin32IPCHandle(userDataPath, type) : getNixIPCHandle(userDataPath, type);
}

function getNixIPCHandle(userDataPath: string, type: string): string {
	return path.join(userDataPath, `${app.getVersion()}-${type}.sock`);
}

function getWin32IPCHandle(userDataPath: string, type: string): string {
	const scope = crypto.createHash('md5').update(userDataPath).digest('hex');
	return `\\\\.\\pipe\\${scope}-${app.getVersion()}-${type}-sock`;
}

export class EnvironmentService implements IEnvironmentService {
	_serviceBrand: undefined;

	@memoize
	get args(): ParsedArgs { return this._args; }

	@memoize
	get userDataPath(): string {
		// TODO: @pikun 当用户改变安装目录的时候，我们可能需要调整此目录？
		return upath.normalizeSafe(app.getPath('userData'));
	}

	// TODO: @pikun 当用户改变安装目录的时候，我们可能需要调整此目录？
	@memoize
	get appRoot(): string { return upath.normalize(app.getAppPath()); }

	@memoize
	get execPath(): string { return this._execPath; }

	@memoize
	get mainIPCHandle(): string { return getIPCHandle(this.userDataPath, IPC_HANDLE_TYPE.MAIN)}

	constructor(private _args: ParsedArgs, private _execPath: string) {

	}

}

