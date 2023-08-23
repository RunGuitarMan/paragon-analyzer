import {autoUpdater} from "electron-updater";
import {BrowserWindow} from "electron";

const setupAutoUpdater = (win: BrowserWindow, isDev: boolean) => {
    const sendStatusToWindow = (code: string, message: string) => {
        win.webContents.send('auto-updater-message', {code, message});
    }

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
        sendStatusToWindow('downloading', `Загружено: ${Math.round(progressObj.percent)}%`);
    });

    autoUpdater.on('update-downloaded', function (info) {
        if (isDev) {
            sendStatusToWindow('completed', 'Установка обновления...');
        } else {
            sendStatusToWindow('download-competed', 'Установка обновления...');
        }
    });

    autoUpdater.on('update-downloaded', function (info) {
        setTimeout(function () {
            if (!isDev) {
                autoUpdater.quitAndInstall();
            }
        }, 3000);
    });

    if (isDev) {
        autoUpdater.checkForUpdates().then(() => {});
    } else {
        autoUpdater.checkForUpdatesAndNotify().then(() => {});
    }
}

export default setupAutoUpdater;