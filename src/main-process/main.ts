
import { app } from 'electron';
import { createWindow } from './main-window';

app.on('ready', async () => {
  createWindow();
});

app.on('window-all-closed', () => app.quit());
