/*
 * @Author: pikun
 * @Date: 2019-12-08 15:14:08
 * @LastEditTime: 2019-12-08 15:44:39
 * @Description:
 */
export const info = (...info: string[]) => {
  console.log(...info);
  console.log(`[*]run-info:`, ...info);
}
/**
 * 仅限函数使用
 */
export const FuncRunningLog = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
	//@ts-ignore
	if (arguments.length !== 3) {
		// 此为参数装饰器
		throw new Error(
			'@FuncRunningLog-decorator can only be used to decorate a parameter'
		);
	}
	const origin = target[propertyKey];
	// aop
	target[propertyKey] = function(...args: any[]) {
			console.log(`[*]run ${target.constructor.name}-${propertyKey} with params:`, args);
			let result = origin.apply(this, args)
			console.log(`[*]run ${target.constructor.name}-${propertyKey} with return:`, result);
			return result;
	}
	return target[propertyKey];
}
