import { createDecorator } from 'sprout/instantiation/instantiation';

export const IEnvironmentService = createDecorator<IEnvironmentService>('environmentService');

// 一些运行环境变量
export interface ParsedArgs {

}

export interface IEnvironmentService {
	_serviceBrand: undefined;
	args: ParsedArgs;
	execPath: string; // 应用执行路径
	appRoot: string; // 应用根目录
	userDataPath: string; // 用户运行数据缓存目录
}
