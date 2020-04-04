const { app, BrowserWindow, ipcMain, dialog } = require('electron');
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
let updateWindow;

function sendStatustoWindow () {
  log.info(text);
  mainWindow.webContents.send('message', 'text');
}


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





app.on('ready', function() {
  createWindow();
  checkUpdate();
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

function checkUpdate () {
autoUpdater.setFeedURL(feed)
setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify()
 }, 20000)
}


//ipcMain.on('restart_app', () => {
  // autoUpdater.quitAndInstall();
  //});
  
  //ipcMain.on('check_for_updates', () => {
    //autoUpdater.checkForUpdatesAndNotify();

  //})





autoUpdater.on('checking-for-update', () => {
  sendStatustoWindow('Suche nach Updates')
});

autoUpdater.on('update-available', (info) => {
  sendStatustoWindow('Update verfuegbar')
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  //  mainWindow.webContents.send('update_downloaded');
  
  let dialogOpts = {
    type: 'Info',
    buttons : ['Neustart', 'Später'],
    title: 'Dashboard-Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'Eine neues Update wurde heruntergeladen. Starten Sie das Dashboard neu '
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
});

autoUpdater.on ('error', message => {
  console.error('Problem beim updaten des Dashboards')
  console.error(message)
})


  autoUpdater.autoDownload = true

