import storage from "electron-json-storage";

const setupSettings = (ipcMain: Electron.IpcMain) => {

    console.log(storage.getDefaultDataPath())

    ipcMain.on('save-settings', (event, settings: any) => {
        console.log('Saving settings...', settings)

        storage.set('settings', settings, (error: any) => {
            if (error) {
                console.error(error);
            }
        });
    });

    ipcMain.handle('get-settings', () => {
        return new Promise<any>((resolve) => {
            console.log('Loading settings...')

            storage.get('settings', (error: any, data: any) => {
                if (error) {
                    console.error(error);

                    return resolve(null);
                }

                return resolve(data);
            })
        });
    })
}

export default setupSettings;