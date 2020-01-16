
import { BrowserWindow } from 'electron';

export const createWindow = () => {
  const win = new BrowserWindow({
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
  const url = process.env.NODE_ENV=='development' ? `file://${__dirname}/../index.html` : `file://${__dirname}/../dist/index.html`;
  win.loadURL(url);
};
