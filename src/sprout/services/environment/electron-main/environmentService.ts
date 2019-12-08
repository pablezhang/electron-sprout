/*
 * @Author: pikun
 * @Date: 2019-12-07 17:56:35
 * @LastEditTime: 2019-12-07 22:06:12
 * @Description:
 */
import { IEnvironmentService, ParsedArgs } from 'sprout/services/environment/common/environment';
import { memoize } from 'sprout/base/common/decorator';
import { app } from 'electron';
import upath from 'upath';
export class EnvironmentService implements IEnvironmentService {
	_serviceBrand: undefined;

	@memoize
	get args(): ParsedArgs { return this._args; }

	@memoize
	get userDataPath(): string {
		// TODO: @pikun 当用户改变安装目录的时候，我们可能需要调整此目录？
		return upath.normalizeSafe(app.getPath('userdata'));
	}

	// TODO: @pikun 当用户改变安装目录的时候，我们可能需要调整此目录？
	@memoize
	get appRoot(): string { return upath.normalize(app.getAppPath()); }

	get execPath(): string { return this._execPath; }

	constructor(private _args: ParsedArgs, private _execPath: string) {

	}

}
