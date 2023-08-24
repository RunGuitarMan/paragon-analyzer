import {screen} from 'electron'

let interval = null;

// width 70%
// height 76%

const setupOverlay = (ipcMain: Electron.IpcMain, win: Electron.BrowserWindow) => {
    ipcMain.on('enable-overlay-mode', () => {
        let primaryDisplay: any;
        primaryDisplay = screen.getPrimaryDisplay();

        const widthPoss = Math.round(15 / 100 * primaryDisplay.size.width);
        const heightPoss = Math.round(12 / 100 * primaryDisplay.size.height);

        win.setSize(widthPoss, Math.round(76 / 100 * primaryDisplay.size.height), true);
        win.setPosition(primaryDisplay.size.width - widthPoss, heightPoss, true)

        win.setIgnoreMouseEvents(true, {forward: true});

        clearOverlayInterval();

        interval = setInterval(() => {
            if (win) {
                win.setAlwaysOnTop(true, "normal");
            }
        }, 100)

        win.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
    });

    ipcMain.on('disable-overlay-mode', () => {
        clearOverlayInterval();

        win.setSize(1420, 850, true);
        win.center();
        win.setIgnoreMouseEvents(false);

        // win.focus();

        win.setAlwaysOnTop(false);
        win.setVisibleOnAllWorkspaces(false);
    });

    ipcMain.on('close', () => {
        clearOverlayInterval();
    });

    const clearOverlayInterval = () => {
        try {
            if (interval) {
                clearInterval(interval);

                interval = null;
            }
        } catch (e) {
            console.log(e)
        }
    }
};

export default setupOverlay;