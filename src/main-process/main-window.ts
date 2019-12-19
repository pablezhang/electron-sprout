
import { BrowserWindow, screen, globalShortcut } from 'electron';

export const createWindow = () => {
  let displays = screen.getAllDisplays()[0];
  console.log('displays:', displays);
  const win = new BrowserWindow({
    show: true,
    width: 0,
    height: displays.size.height,
    x: displays.size.width,
    y: 0,
    frame: true,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: true,
      allowRunningInsecureContent: false,
      nativeWindowOpen: false,
      nodeIntegration: true,
    },
  });

  process.nextTick(() => {
    win.setBounds({
      width: 890,
      height: displays.size.height,
      x: displays.size.width,
      y: 0,
    });
  });

  win.addListener('move', () => {
 
  });

  globalShortcut.register('CommandOrControl+Left', () => {
    win.setPosition(
      displays.size.width - 890,
      0,
      true
    );
  });
  globalShortcut.register('CommandOrControl+Right', () => {
    win.setPosition(
      1680,
      0,
      true
    );
  });
  win.loadURL(`file://${__dirname}/../index.html`);

};
