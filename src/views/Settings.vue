<template>
<div class="page-wrapper">
    <img class="background" src="../assets/images/backgrounds/2.png" alt="background">
    <div class="page-content">
        <div class="title-wrapper">
            <i class="pi pi-cog"></i>
            <h1 class="title-name">Настройки</h1>
        </div>
        <div class="controls" v-if="isDataReady">
            <div class="row">
                <div class="field">
                    <div class="p-float-label">
                        <Dropdown id="enable-disable-overlay" v-model="settingsStore.enableDisableOverlayKey" :options="keys" @change="onKeyChanged">
                            <template #value="slotProps">
                                <div class="role-item" v-if="slotProps.value">
                                    <span>{{keysDef[settingsStore.enableDisableOverlayKey]}}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="role-item">
                                    <span>{{ keysDef[slotProps.option] }}</span>
                                </div>
                            </template>
                        </Dropdown>
                        <label for="enable-disable-overlay">Вкл \ Выкл оверлей</label>
                    </div>
                </div>
                <div class="field">
                    <div class="p-float-label">
                        <Dropdown id="enable-disable-overlay" v-model="settingsStore.toggleOverlayKey" :options="keys" @change="onKeyChanged">
                            <template #value="slotProps">
                                <div class="role-item" v-if="slotProps.value">
                                    <span>{{keysDef[settingsStore.toggleOverlayKey]}}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="role-item">
                                    <span>{{ keysDef[slotProps.option] }}</span>
                                </div>
                            </template>
                        </Dropdown>
                        <label for="enable-disable-overlay">Показать оверлей</label>
                    </div>
                </div>
            </div>
            <span class="note">*Настройки управления применятся только после перезапуска приложения</span>
        </div>
    </div>
    <Toast/>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import createSettingsStore, {ISettingsStore} from "../stores/settings.store";
import {qKeys} from "../interfaces/keys";
import {useToast} from "primevue/usetoast";

@Options({
    beforeMount() {
        this.setupKeys();
        this.loadSettings();
    }
})
export default class SettingsView extends Vue {

    toast = useToast();
    settingsStore = createSettingsStore();

    isDataReady = false;

    keysDef = qKeys;

    keys: qKeys[];

    setupKeys() {
        this.keys = Object.values(qKeys).filter((v) => !isNaN(Number(v)));
    }

    loadSettings() {
        this.settingsStore.getSettings().then((result) => {
            this.isDataReady = true;
        })
    }

    onKeyChanged() {
        this.settingsStore.saveSettings();

        this.toast.add({severity: 'success',  detail: 'Настройки сохранены', life: 3000, closable: false});

    }
}

</script>

<style lang="scss" scoped>

.page-wrapper {
    display: flex;
    justify-content: center;

    position: relative;

    .page-content {
        width: 100%;

        z-index: 1;

        flex-direction: column;
    }
}

.controls {
    display: flex;
    flex-direction: column;

    margin-top: 32px;
    padding: 16px 32px;

    border-radius: 8px;
    background: var(--background-color-secondary);

    .row {
        display: flex;
    }

    > span {
        b {
            color: #D7B168;
        }

        &:not(:last-child) {
            margin-bottom: 8px;
        }
    }

    .field {
        width: 200px;

        &:not(:first-child) {
            margin-left: 16px;
        }
    }

    .note {
        color: var(--text-color);

        margin-top: 32px;
        font-size: 12px;
    }
}

</style>
