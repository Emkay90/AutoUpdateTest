const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const devMode = (process.argv || []).indexOf('--dev') !== -1




autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App startet');

if (devMode) {
  //lade App Dependencies
  const nodeModulesPfad = path.join(__dirname, '..', '..', 'app', 'node_modules')
  require('module').globalPaths.push(nodeModulesPfad)
}

let mainWindow;


function sendStatustoWindow (text) {
  log.info(text);
  if(mainWindow) {
  mainWindow.webContents.send('message', 'text');
}
};




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

  mainWindow.on('ready-to-show', () => {
  
  });
 
}


function checkUpdate () {
  
  }


app.on('ready', () => {
  createWindow();
  const server = 'https://github.com/Emkay90/AutoUpdateTest.git';
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`
  autoUpdater.setFeedURL(feed)
  console.log('Suche alle 10 sek nach Updates')
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
   }, 10000)

  
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

checkUpdate();

ipcMain.on('check_for_updates', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
// autoUpdater.on('checking-for-update', () => {
//   sendStatustoWindow('Suche nach Updates')
// });

autoUpdater.on('update-available', (info) => {
  sendStatustoWindow('Update verfuegbar')


});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    // mainWindow.webContents.send('Update heruntergeladen');

  
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

autoUpdater.on('update-not-available', (event) => {
  mainWindow.webContents.send('Kein Update verfuegbar');
  sendStatusToWindow(event);
});

autoUpdater.on ('error', message => {
  console.error('Problem beim updaten des Dashboards')
  console.error(message)
   
})
  autoUpdater.autoDownload = true











