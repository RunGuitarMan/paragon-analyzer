<template>
<div class="preloader">
    <img src="../../src/assets/logo-transparent.png" alt="logo">
    <span>{{ message }}</span>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import electron from "electron";
import createAppStore from "../stores/app.store";
import createOverlayStore from "../stores/overlay.store";

@Options({
    beforeMount() {
        this.setup();
    }
})
export default class Preloader extends Vue {
    appStore = createAppStore();

    message = 'Загрузка...';

    setup() {
        electron.ipcRenderer.on('auto-updater-message',  (evt, { code, message }) => {
            this.message = message;

            if (code === 'completed') {
                this.finishPreloading();
            }
        });

        window.onkeydown = (event) => {
            if (event.code === 'Digit1') {
                this.finishPreloading();
            }
        }
    }

    finishPreloading() {
        this.appStore.isPreloader = true;

        electron.ipcRenderer.send('preloading-completed');
    }
}

</script>


<style lang="scss" scoped>

.preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--background-color-secondary);
    z-index: 9999;

    > img {
        animation: square-spin 5s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
    }

    > span {
        font-family: "HeadingNow", Arial, Helvetica, sans-serif;
        margin-top: 32px;
        text-align: center;
    }
}

@keyframes square-spin {
    25% { transform: rotateX(180deg) rotateY(0); }
    50% { transform: rotateX(180deg) rotateY(180deg); }
    75% { transform: rotateX(0) rotateY(180deg); }
    100% { transform: rotateX(0) rotateY(0); }
}

</style>
