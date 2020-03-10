const { ipcRenderer } = require('electron');
const version = document.getElementById('version');
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');


ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.removeAllListeners('app_version');
  version.innerText = 'Version ' + arg.version;
});

ipcRenderer.on('update_available', () => {
ipcRenderer.removeAllListeners('update_available');
message.innerText = 'Neues Update verfügbar. Lade herunter...';
notification.classList.remove('hidden');
});


ipcRenderer.on('update_downloaded', () => {
ipcRenderer.removeAllListeners('update_downloaded');
message.innerText = 'Update heruntergeladen. Es wird beim nächsten Neustart installiert. Jetzt neustarten?';
restartButton.classList.remove('hidden');
notification.classList.remove('hidden');
});


function closeNotification() {
notification.classList.add('hidden');
}
function restartApp() {
ipcRenderer.send('restart_app');
}

function checkForUpdates() {
    ipcRenderer.send('check_for_updates');
}