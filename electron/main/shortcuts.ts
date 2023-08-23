import {qHotkeys, qKeys} from "qhotkeys";
import {globalShortcut} from "electron";

const hotkeys = new qHotkeys();

const setupShortcuts = (app: Electron.App, win: BrowserWindow) => {
    app.whenReady().then(() => {
        globalShortcut.register('Shift+Space', () => {
            win.webContents.send('toggle-overlay-event');
        });

        hotkeys.register([qKeys.I], () => {
            win.webContents.send('toggle-overlay-visibility');
        });

        hotkeys.register([qKeys.Escape], () => {
            win.webContents.send('toggle-overlay-visibility-hide');
        })

        hotkeys.run();

        globalShortcut.unregister('CommandOrControl+R');
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
};

export default setupShortcuts;