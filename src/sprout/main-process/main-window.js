define(["require", "exports", "electron"], function (require, exports, electron_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createWindow = () => {
        const win = new electron_1.BrowserWindow({
            show: true,
            width: 890,
            height: 556,
            frame: true,
            transparent: false,
            webPreferences: {
                webSecurity: true,
                allowRunningInsecureContent: false,
                nativeWindowOpen: false,
                nodeIntegration: true,
            },
        });
        win.webContents.openDevTools();
        win.loadURL(`file://${__dirname}/../../index.html`);
    };
});
