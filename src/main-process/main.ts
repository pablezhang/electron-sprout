
import { app, globalShortcut } from 'electron';
import { createWindow } from './main-window';

app.on('ready', async () => {
  createWindow();
});

app.on('window-all-closed', () => app.quit());

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll()
})