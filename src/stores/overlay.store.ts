import {defineStore} from "pinia";

import electron from "electron";
import {useRouter} from "vue-router";

interface IOverlayStore {
    isEnabled: boolean;
}

const router = useRouter();


// @ts-ignore
const overlayStore = defineStore('overlay-store', {
    state: () :IOverlayStore => ({
        isEnabled: false
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

const createOverlayStore = () => overlayStore();

export default createOverlayStore;