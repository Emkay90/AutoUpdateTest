const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const devMode = (process.argv || []).indexOf('--dev') !== -1
const server = 'https://github.com/Emkay90/AutoUpdateTest.git';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`


if (devMode) {
  //lade App Dependencies
  const nodeModulesPfad = path.join(__dirname, '..', '..', 'app', 'node_modules')
  require('module').globalPaths.push(nodeModulesPfad)
}

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
 
}


app.on('ready', () => {
  createWindow();
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });
  
  ipcMain.on('check_for_updates', () => {
    autoUpdater.checkForUpdatesAndNotify();

  })

  ipcMain.on ('auto_Search'), () => {
    const server = 'https://github.com/Emkay90/AutoUpdateTest.git';
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`
    autoUpdater.setFeedURL(feed)
    setInterval(() => {
      autoUpdater.checkForUpdates()
      autoUpdater.checkForUpdatesAndNotify();
     }, 60000)
  }



autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });

  autoUpdater.autoDownload = true

