import {app, BrowserWindow, shell, ipcMain} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'
import {autoUpdater} from 'electron-updater';
import * as path from "path";

import setupAutoUpdater from './autoUpdater';
import setupShortcuts from './shortcuts';
import setupOverlay from './overlay';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1'))
    app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
    app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

const isDev = () => {
    return !app.isPackaged;
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = false;

if (isDev()) {
    autoUpdater.updateConfigPath = path.join(
        join(__dirname, '..', '..'),
        'dev-app-update.yml'
    );

    autoUpdater.forceDevUpdateConfig = true;
}

app.commandLine.appendSwitch("disable-http-cache");

async function createWindow() {
    win = new BrowserWindow({
        title: 'Paragon Analytics',
        icon: join(process.env.VITE_PUBLIC, 'logo.png'),
        frame: false,
        width: 300,
        height: 400,
        resizable: true,
        center: true,
        transparent: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
    })

    win.setBackgroundColor('rgba(0, 0, 0, 0)');
    win.focus();

    if (isDev()) {
        win.loadURL(url).then(() => {})

        win.webContents.openDevTools({mode: 'detach', activate: false})
    } else {
        win.loadFile(indexHtml).then(() => {})
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return {action: 'deny'}
    })


    win.webContents.once("dom-ready", () => {
        setupAutoUpdater(win, isDev());
    });

    setupShortcuts(app, win);
    setupOverlay(ipcMain, win);
}


app.whenReady().then(() => {
    setTimeout(createWindow, 500)
})

app.on('window-all-closed', () => {
    win = null

    if (process.platform !== 'darwin')
        app.quit()
})

ipcMain.on('preloading-completed', () => {
    win.setSize(1420, 850, true);
    win.center();
});

ipcMain.on('minimize', () => {
    win.minimize();
});

ipcMain.on('close', () => {
    win.close();
});



