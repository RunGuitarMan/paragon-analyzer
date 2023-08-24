import {qHotkeys, qKeys} from "qhotkeys";
import {globalShortcut} from "electron";
import storage from "electron-json-storage";

const hotkeys = new qHotkeys();

const setupShortcuts = (app: Electron.App, win: Electron.BrowserWindow) => {
    app.whenReady().then(() => {
        globalShortcut.register('Shift+Space', () => {
            win.webContents.send('toggle-overlay-event');
        });

        storage.get('settings', (error: any, data: any) => {
            if (Object.getOwnPropertyNames(data).length > 0) {
                console.log('Register hotkeys from settings', data)

                hotkeys.register([data.toggleOverlayKey], () => {
                    win.webContents.send('toggle-overlay-visibility');
                });

                hotkeys.register([data.enableDisableOverlayKey], () => {
                    win.webContents.send('toggle-overlay-event');
                })
            } else {
                console.log('Register hotkeys from defaults')

                hotkeys.register([qKeys.I], () => {
                    win.webContents.send('toggle-overlay-visibility');
                });

                hotkeys.register([qKeys.Insert], () => {
                    win.webContents.send('toggle-overlay-event');
                });
            }

            hotkeys.register([qKeys.Escape], () => {
                win.webContents.send('toggle-overlay-visibility-hide');
            })

            console.log('Registering...')

            hotkeys.run();
        })

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