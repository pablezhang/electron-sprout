
import { app } from 'electron';
import { createWindow } from './windows/main-window';

app.on('ready', async () => {
  createWindow();
});

app.on('window-all-closed', () => app.quit());
