import {defineStore} from "pinia";
import electron from "electron";
import {qKeys} from "../interfaces/keys";


export interface ISettingsStore {
    enableDisableOverlayKey: qKeys;
    toggleOverlayKey: qKeys;
}

const settingsStore = defineStore('settings-store', {
    state: () :ISettingsStore => ({
        enableDisableOverlayKey: qKeys.Insert,
        toggleOverlayKey: qKeys.I
    }),
    actions: {
        async getSettings() {
            const settingsJSON = await electron.ipcRenderer.invoke('get-settings');
            if (settingsJSON) {
                this.$state = settingsJSON;
            }

            return this.$state;
        },
        saveSettings(settings?: ISettingsStore) {
            if (settings) {
                electron.ipcRenderer.send('save-settings', JSON.parse(JSON.stringify(settings)));
            } else {
                electron.ipcRenderer.send('save-settings', JSON.parse(JSON.stringify(this.$state)));
            }
        }
    }
});

const createSettingsStore = () => settingsStore();

export default createSettingsStore;