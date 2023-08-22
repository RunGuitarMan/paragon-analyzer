import {app, BrowserWindow, shell, ipcMain, globalShortcut, screen} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'
import {autoUpdater} from 'electron-updater';
import * as path from "path";
import {qHotkeys, qKeys} from "qhotkeys"

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

// width 70%
// height 76%

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
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


console.log(join(process.env.VITE_PUBLIC, 'logo.svg'))

async function createWindow() {
    win = new BrowserWindow({
        title: 'Paragon Analystiscs',
        icon: join(process.env.VITE_PUBLIC, 'logo.png'),
        frame: false,
        width: 300,
        height: 400,
        resizable: true,
        center: true,
        transparent: true,
        webPreferences: {
            // preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            contextIsolation: false,
            nodeIntegration: true
        },
        // alwaysOnTop: true

    })
    // win.setIgnoreMouseEvents(true, { forward: true });
    win.setBackgroundColor('rgba(0, 0, 0, 0)');

    win.focus();

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools({mode: 'detach', activate: false})
    } else {
        win.loadFile(indexHtml)
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
        if (isDev()) {
            autoUpdater.checkForUpdates().then((result) => {
                console.log(result)
            })
        } else {
            autoUpdater.checkForUpdatesAndNotify().then((result) => {
                console.log(result)
            })
        }
    });

    // win.webContents.on('will-navigate', (event, url) => { }) #344
}

const hotkeys = new qHotkeys();

app.whenReady().then(() => {
    globalShortcut.register('Shift+Capslock', () => {
        win.webContents.send('toggle-overlay-event');
    });

    hotkeys.register([qKeys.I], () => {
        win.webContents.send('toggle-overlay-visibility');
    });

    hotkeys.register([qKeys.Escape], () => {
        win.webContents.send('toggle-overlay-visibility');
    })

    hotkeys.run();

    globalShortcut.unregister('CommandOrControl+R');

    setTimeout(createWindow, 500)
});

app.on('browser-window-focus', function () {
    globalShortcut.register("CommandOrControl+R", () => {
        console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
    globalShortcut.register("F5", () => {
        console.log("F5 is pressed: Shortcut Disabled");
    });
});

app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
});

app.on('window-all-closed', () => {
    clearInterval(interval);

    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    console.log(32)
    setTimeout(() => {
        const childWindow = new BrowserWindow({
            transparent: false,
            webPreferences: {
                preload,
                nodeIntegration: true,
                contextIsolation: false,
            },
        })

        if (process.env.VITE_DEV_SERVER_URL) {
            childWindow.loadURL(`${url}#${arg}`)
        } else {
            childWindow.loadFile(indexHtml, {hash: arg})
        }
    }, 5000)
})

ipcMain.on('minimize', () => {
    win.minimize();
});

ipcMain.on('close', () => {
    clearInterval(interval);

    win.close();
});

let interval = null;

ipcMain.on('enable-overlay-mode', () => {
    const primaryDisplay = screen.getPrimaryDisplay()

    const widthPoss = Math.round(15 / 100 * primaryDisplay.size.width);
    const heightPoss = Math.round(12 / 100 * primaryDisplay.size.height);

    win.setSize(widthPoss, Math.round(76 / 100 * primaryDisplay.size.height), true);
    win.setPosition(primaryDisplay.size.width - widthPoss, heightPoss, true)

    win.setIgnoreMouseEvents(true, {forward: true});

    clearInterval(interval);
    interval = setInterval(() => {
        if (win) {
            win.setAlwaysOnTop(true, "normal");
        }
    }, 100)

    win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
    // win.focus();
});

ipcMain.on('disable-overlay-mode', () => {
    win.setSize(1420, 850, true);
    win.center();
    win.setIgnoreMouseEvents(false);

    clearInterval(interval);

    win.setAlwaysOnTop(false);
    win.setVisibleOnAllWorkspaces(false);
    // win.focus();
});

ipcMain.on('preloading-completed', () => {
    win.setSize(1420, 850, true);
    win.center();
});

autoUpdater.on('checking-for-update', function () {
    sendStatusToWindow('checking-for-update', 'Проверяем наличие обновления...');
});

autoUpdater.on('update-available', function (info) {
    sendStatusToWindow('start-download', 'Загрузка обновления');
});

autoUpdater.on('update-not-available', function (info) {
    sendStatusToWindow('completed', 'Уже установленна последняя версия');
});

autoUpdater.on('error', function (err) {
    sendStatusToWindow('error', 'Ошибка авто обновления');
});

autoUpdater.on('download-progress', function (progressObj) {
    let log_message = `Загружено: ${Math.round(progressObj.percent)}%`;
    sendStatusToWindow('downloading', log_message);

    console.log(log_message)
});

autoUpdater.on('update-downloaded', function (info) {
    if (isDev()) {
        sendStatusToWindow('completed', 'Установка обновления...');
    } else {
        sendStatusToWindow('download-competed', 'Установка обновления...');
    }
});

autoUpdater.on('update-downloaded', function (info) {
    setTimeout(function () {
        if (!isDev()) {
            autoUpdater.quitAndInstall();
        }
    }, 3000);
});

const sendStatusToWindow = (code: string, message: string) => {
    win.webContents.send('auto-updater-message', {code, message});
}
