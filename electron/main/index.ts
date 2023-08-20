import {app, BrowserWindow, shell, ipcMain, globalShortcut, screen } from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'

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
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
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

async function createWindow() {
    win = new BrowserWindow({
        title: 'Paragon Analystiscs',
        icon: join(process.env.VITE_PUBLIC, 'logo.svg'),
        frame: false,
        width: 1420,
        height: 850,
        resizable: true,
        center: true,
        transparent: true,
        webPreferences: {
            preload,
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

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools({ mode: 'detach', activate: false })
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

    // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(() => {
    globalShortcut.register('Shift+Capslock', () => {
        console.log('Electron loves global shortcuts!')

        win.webContents.send('toggle-overlay-event', {'SAVED': 'File Saved'});
    })

    setTimeout(createWindow, 500)
});

app.on('window-all-closed', () => {
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
    win.close();
});

let interval = null;

ipcMain.on('enable-overlay-mode', () => {
    const primaryDisplay = screen.getPrimaryDisplay()

    const widthPoss = Math.round(15 / 100 * primaryDisplay.size.width);
    const heightPoss = Math.round(12 / 100 * primaryDisplay.size.height);

    win.setSize(widthPoss, Math.round(76 / 100 * primaryDisplay.size.height), true);
    win.setPosition(primaryDisplay.size.width - widthPoss, heightPoss, true)

    win.setIgnoreMouseEvents(true, { forward: true });

    clearInterval(interval)
    interval = setInterval(() => {
        win.setAlwaysOnTop(true, "normal");

    }, 100)

    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // win.focus();
});

ipcMain.on('disable-overlay-mode', () => {
    win.setSize(1420, 850, true);
    win.center();
    win.setIgnoreMouseEvents(false);
    win.setAlwaysOnTop(false);
    // win.focus();
});