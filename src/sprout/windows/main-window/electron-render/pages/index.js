define(["require", "exports", "react", "mobx-react", "react-router-dom", "./mobx-demo/index", "../stores/stores"], function (require, exports, react_1, mobx_react_1, react_router_dom_1, index_1, stores_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function App() {
        return (react_1.default.createElement(mobx_react_1.Provider, Object.assign({}, stores_1.stores),
            react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/", component: index_1.Demo })))));
    }
    exports.App = App;
});
