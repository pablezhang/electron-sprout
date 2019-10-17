
import { BrowserWindow } from 'electron';

export const createWindow = () => {
  const win = new BrowserWindow({
    show: true,
    width: 890,
    height: 556,
    resizable: true, // 禁止窗口缩小放大，暂时避免因此对录屏造成的影响。
    // @ts-ignore
    webgl: true,
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
  win.loadURL(`file://${__dirname}/../index.html`);
};
