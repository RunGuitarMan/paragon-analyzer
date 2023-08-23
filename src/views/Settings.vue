<template>
<div class="page-wrapper">
    <img class="background" src="../assets/images/backgrounds/2.png" alt="background">
    <div class="page-content">
        <div class="title-wrapper">
            <i class="pi pi-cog"></i>
            <h1 class="title-name">Настройки</h1>
        </div>
        <div class="controls">
            <span>Вкл \ Выкл оверлей: <b>Shift + Space</b></span>
            <span>Показать оверлей: <b>I</b></span>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import {useRoute, useRouter} from "vue-router";

import {IChampion} from "../interfaces/IChampion";

import {getSkillIcon} from "../utils/utils";
import GameItem from "../components/GameItem.vue";
import {IBuild} from "../interfaces/IBuild";

import electron from "electron";
import createTesseractStore from "../stores/tesseract.store";
import createChampionsStore from "../stores/champions.store";

@Options({})
export default class SettingsView extends Vue {

    isDataReady = false;
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
    flex-direction:column;

    margin-top: 32px;
    padding: 16px 32px;


    border-radius: 8px;
    background: var(--background-color-secondary);

    > span {
        b {
            color: #D7B168;
        }

        &:not(:last-child) {
            margin-bottom: 8px;
        }
    }
}

</style>
