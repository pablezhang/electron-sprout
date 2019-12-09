define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*
     * @Author: pikun
     * @Date: 2019-12-08 15:14:08
     * @LastEditTime: 2019-12-08 17:02:50
     * @Description:
     */
    exports.info = (...info) => {
        console.log(`[*]run-info:`, ...info);
    };
    /**
     * 仅限函数使用
     */
    exports.FuncRunningLog = (target, propertyKey, descriptor) => {
        if (descriptor === undefined) {
            // 此为参数装饰器
            throw new Error('@FuncRunningLog-decorator can only be used to decorate a function');
        }
        const origin = target[propertyKey];
        // aop
        target[propertyKey] = function (...args) {
            console.log(`[*]run ${target.constructor.name}-${propertyKey} with params:`, args);
            let result = origin.apply(this, args);
            // console.log(`[*]run ${target.constructor.name}-${propertyKey} with return:`, `${result}`);
            return result;
        };
        return target[propertyKey];
    };
});
