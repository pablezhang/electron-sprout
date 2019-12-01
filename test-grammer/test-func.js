// (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'renderer')

console.log(process.env)
console.log(process.type)

const { electron, app, BrowserWindow } = require('electron');

app.on('ready', () => {
  console.log(process.type);
  const win = new BrowserWindow({
    width: 100,
    height: 100,
    webPreferences: {
      webSecurity: true,
      allowRunningInsecureContent: false,
      nativeWindowOpen: false,
      nodeIntegration: true,
    },
  });
  win.loadURL((`file://${__dirname}/index.html`))
  win.webContents.openDevTools();
});