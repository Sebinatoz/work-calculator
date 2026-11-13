const { app, BrowserWindow, shell, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Configure autoUpdater
autoUpdater.logger = console;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow = null;

// Safe updater check helper
async function checkForUpdatesSafe(manual = false) {
  if (!app.isPackaged) {
    console.log('[Updater] Mode développement : vérification simulée (non packagé).');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:not-available', {
        version: app.getVersion(),
        isDev: true,
        message: 'Mode développement (non packagé)',
      });
    }
    return { status: 'dev' };
  }

  try {
    return await autoUpdater.checkForUpdates();
  } catch (err) {
    console.error('[Updater] Erreur lors de la vérification :', err);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:error', {
        message: err.message || 'Impossible de vérifier les mises à jour pour le moment.',
      });
    }
    return { error: err.message };
  }
}

// Forward autoUpdater events to the renderer window
autoUpdater.on('checking-for-update', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:checking');
  }
});

autoUpdater.on('update-available', (info) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:available', {
      version: info.version,
      releaseNotes: info.releaseNotes,
      releaseDate: info.releaseDate,
    });
  }
});

autoUpdater.on('update-not-available', (info) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:not-available', {
      version: app.getVersion(),
    });
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:progress', {
      percent: Math.round(progressObj.percent || 0),
      bytesPerSecond: progressObj.bytesPerSecond || 0,
      transferred: progressObj.transferred || 0,
      total: progressObj.total || 0,
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:downloaded', {
      version: info.version,
    });
  }
});

autoUpdater.on('error', (err) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:error', {
      message: err && err.message ? err.message : String(err),
    });
  }
});

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development';
  const iconPath = process.platform === 'win32'
    ? path.join(__dirname, '../assets/icon.ico')
    : path.join(__dirname, '../assets/icon.png');

  mainWindow = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 960,
    minHeight: 640,
    title: 'Work Calculator • Suivi des Heures de Prestation',
    icon: iconPath,
    backgroundColor: '#0f172a',
    show: false, // Wait until ready-to-show to prevent visual flash
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false,
      spellcheck: false,
    },
  });

  // Load the built dist/index.html or dev server
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // In production, automatically check for updates after 4 seconds
    if (app.isPackaged) {
      setTimeout(() => {
        checkForUpdatesSafe(false);
      }, 4000);
    }
  });

  // Handle external links (open in user's default browser)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Custom Application Menu
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Imprimer / Exporter PDF',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow.webContents.print();
          },
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' },
        { role: 'selectAll', label: 'Tout sélectionner' },
      ],
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Actualiser' },
        { role: 'forceReload', label: 'Actualiser (forcer)' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Taille normale' },
        { role: 'zoomIn', label: 'Zoom avant' },
        { role: 'zoomOut', label: 'Zoom arrière' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' },
      ],
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Vérifier les mises à jour...',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('updater:manual-check-requested');
            }
            checkForUpdatesSafe(true);
          },
        },
        { type: 'separator' },
        {
          label: 'Dépôt GitHub',
          click: () => {
            shell.openExternal('https://github.com/Sebinatoz/work-calculator');
          },
        },
        {
          label: 'À propos de Work Calculator',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos',
              message: `Work Calculator v${app.getVersion()}`,
              detail: "Calculateur d'heures de prestation avec gestion des heures supplémentaires, du solde de récupération et export conforme.\n\nCréé par Sebinatoz.",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('app:get-version', () => app.getVersion());

ipcMain.handle('app:check-for-updates', async () => {
  return await checkForUpdatesSafe(true);
});

ipcMain.handle('app:download-update', async () => {
  try {
    return await autoUpdater.downloadUpdate();
  } catch (err) {
    console.error('[Updater] Erreur downloadUpdate :', err);
    throw err;
  }
});

ipcMain.handle('app:quit-and-install', () => {
  setImmediate(() => {
    autoUpdater.quitAndInstall(false, true);
  });
});

ipcMain.handle('app:open-external', async (_event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    await shell.openExternal(url);
  }
});

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
