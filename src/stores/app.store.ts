import {defineStore} from "pinia";
import electron from "electron";

interface IAppStoreState {
    isPreloader: boolean;
}

// @ts-ignore
const appStore = defineStore('app-store', {
    state: () :IAppStoreState => ({
        isPreloader: false
    })
});

const createAppStore = () => appStore();

export default createAppStore;