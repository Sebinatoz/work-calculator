const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  checkForUpdates: () => ipcRenderer.invoke('app:check-for-updates'),
  startDownloadUpdate: () => ipcRenderer.invoke('app:download-update'),
  quitAndInstall: () => ipcRenderer.invoke('app:quit-and-install'),
  openExternal: (url) => ipcRenderer.invoke('app:open-external', url),

  onUpdateChecking: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('updater:checking', handler);
    return () => ipcRenderer.removeListener('updater:checking', handler);
  },
  onUpdateAvailable: (callback) => {
    const handler = (_event, info) => callback(info);
    ipcRenderer.on('updater:available', handler);
    return () => ipcRenderer.removeListener('updater:available', handler);
  },
  onUpdateNotAvailable: (callback) => {
    const handler = (_event, info) => callback(info);
    ipcRenderer.on('updater:not-available', handler);
    return () => ipcRenderer.removeListener('updater:not-available', handler);
  },
  onUpdateProgress: (callback) => {
    const handler = (_event, progress) => callback(progress);
    ipcRenderer.on('updater:progress', handler);
    return () => ipcRenderer.removeListener('updater:progress', handler);
  },
  onUpdateDownloaded: (callback) => {
    const handler = (_event, info) => callback(info);
    ipcRenderer.on('updater:downloaded', handler);
    return () => ipcRenderer.removeListener('updater:downloaded', handler);
  },
  onUpdateError: (callback) => {
    const handler = (_event, err) => callback(err);
    ipcRenderer.on('updater:error', handler);
    return () => ipcRenderer.removeListener('updater:error', handler);
  },
  onManualCheckRequested: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('updater:manual-check-requested', handler);
    return () => ipcRenderer.removeListener('updater:manual-check-requested', handler);
  },
});
