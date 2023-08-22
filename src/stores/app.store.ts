import {defineStore} from "pinia";
import electron from "electron";

interface IAppStoreState {
    isPreloader: boolean;
}

// @ts-ignore
const appStore = defineStore('app-store', {
    state: () :IAppStoreState => ({
        isPreloader: false
    }),
    actions: {
        toggle() {
            this.isEnabled = !this.isEnabled;
            if (this.isEnabled) {
                electron.ipcRenderer.send('enable-overlay-mode', '');

                document.body.style.background = 'transparent';
                document.body.classList.add('overlay');
            } else {
                electron.ipcRenderer.send('disable-overlay-mode', '');

                document.body.style.removeProperty('background')
                document.body.classList.remove('overlay');

                // router.push('/champions');
            }
        }
    }
});

const createAppStore = () => appStore();

export default createAppStore;