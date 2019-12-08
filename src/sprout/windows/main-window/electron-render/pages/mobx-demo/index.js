define(["require", "exports", "tslib", "react", "mobx-react"], function (require, exports, tslib_1, react_1, mobx_react_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Demo = class Demo extends react_1.PureComponent {
        render() {
            return (react_1.default.createElement("div", null,
                "Demo-cc:",
                this.props.demoStore.cc,
                react_1.default.createElement("button", { onClick: this.props.demoStore.changeCount }, "\u6539\u53D8count"),
                react_1.default.createElement("br", null),
                "Demo-bb:",
                this.props.demoStore.bb,
                react_1.default.createElement("button", { onClick: this.props.demoStore.changeTest }, "\u6539\u53D8Test")));
        }
    };
    Demo = tslib_1.__decorate([
        mobx_react_1.inject('demoStore'),
        mobx_react_1.observer
    ], Demo);
    exports.Demo = Demo;
});
