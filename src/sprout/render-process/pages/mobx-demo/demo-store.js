define(["require", "exports", "tslib", "mobx"], function (require, exports, tslib_1, mobx_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 做一些全局配置，比如： enforceActions，表示此store种更改状态必须使用action
    mobx_1.configure({
        enforceActions: true,
        computedConfigurable: false,
    });
    class DemoStore {
        constructor() {
            this.count = 0; // 定义一个状态变化量，给他@observable检测上。
            this.test = 1;
            this.changeCount = () => {
                console.log('改变count');
                this.count++;
            };
            this.changeTest = () => {
                console.log('改变test');
                this.test++;
            };
        }
        get cc() {
            console.log('属性变化了，执行此函数-cc');
            return this.count + 2;
        }
        get bb() {
            console.log('属性变化了，执行此函数-bb');
            return this.count + 2;
        }
    }
    tslib_1.__decorate([
        mobx_1.observable
    ], DemoStore.prototype, "count", void 0);
    tslib_1.__decorate([
        mobx_1.observable
    ], DemoStore.prototype, "test", void 0);
    tslib_1.__decorate([
        mobx_1.action // 定义一个改变状态的action
    ], DemoStore.prototype, "changeCount", void 0);
    tslib_1.__decorate([
        mobx_1.action // 定义一个改变状态的action
    ], DemoStore.prototype, "changeTest", void 0);
    tslib_1.__decorate([
        mobx_1.computed
    ], DemoStore.prototype, "cc", null);
    tslib_1.__decorate([
        mobx_1.computed
    ], DemoStore.prototype, "bb", null);
    exports.demoStore = new DemoStore();
    mobx_1.autorun(() => {
        // 在autorun里用到了哪个变量，如果他变化了，则会自动执行一次autorun
        console.log('demoStore-count:', exports.demoStore.count);
    });
    mobx_1.autorun(() => {
        // 在autorun里用到了哪个变量，如果他变化了，则会自动执行一次autorun
        console.log('demoStore-test:', exports.demoStore.test);
    });
});
