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

            } else {

            }
        }
    }
});

const createOverlayStore = () => overlayStore();

export default createOverlayStore;