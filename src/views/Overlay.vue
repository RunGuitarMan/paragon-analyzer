<template>
<div class="page-wrapper champion-overlay" v-if="champion && isVisible">
    <div class="build-items-wrapper" v-if="currentBuild.items?.length">
        <span>Сборка</span>
        <div class="build-items main">
            <game-item v-for="(item, index) in currentBuild.items" :name="item"></game-item>
        </div>
    </div>
    <div class="build-items-wrapper" v-if="currentBuild.coreItems?.length">
        <span>Порядок покупки</span>
        <div class="build-items">
            <template v-for="(item, index) in currentBuild.coreItems">
                <game-item :name="item"></game-item>
                <i class="pi pi-angle-right" v-if="index !== currentBuild.coreItems.length - 1"></i>
            </template>

        </div>
    </div>
    <div class="build-items-wrapper" v-if="currentBuild.situationalItems?.length">
        <span>Ситуативно</span>
        <div class="build-items">
            <game-item v-for="(item, index) in currentBuild.situationalItems" :name="item"></game-item>
        </div>
    </div>
    <div class="skills-order" v-if="currentBuild.skillsOrder">
        <div class="skills">
            <img :src="getSkillIcon('q')" alt="q">
            <img :src="getSkillIcon('e')" alt="e">
            <img :src="getSkillIcon('r')" alt="r">
            <img :src="getSkillIcon('u')" alt="u">
        </div>
        <div class="order" v-for="(skill, index) in currentBuild.skillsOrder">
            <span>{{ index + 1 }}</span>
            <div class="order-cell">
                <span v-if="skill === 'q'" style="color: #EB4242">Q</span>
            </div>
            <div class="order-cell">
                <span v-if="skill === 'e'" style="color: #28B5B0">E</span>
            </div>
            <div class="order-cell">
                <span v-if="skill === 'r'" style="color: #409FE5">R</span>
            </div>
            <div class="order-cell">
                <span v-if="skill === 'u'" style="color: #CCA35E">U</span>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import {useRoute, useRouter} from "vue-router";

import championsJSON from '../assets/static/champions.json';
import {IChampion} from "../interfaces/IChampion";

import {getChampionIcon, getKarmaIcon, getRoleIcon, getSkillIcon} from "../utils/utils";
import {Role, RoleItem, roles} from "../interfaces/role.type";
import GameItem from "../components/GameItem.vue";
import {IBuild} from "../interfaces/IBuild";

import overlay from "electron-overlay-window"
import electron from "electron";

@Options({
    components: {GameItem},
    beforeMount() {
        const route = useRoute();
        const name = route.params.name;
        const buildName = route.query.build;

        this.setChampion(name, buildName);

        this.setupOverlay();
    },
    beforeUnmount() {
        electron.ipcRenderer.removeListener('toggle-overlay-event', this.onToggleEvent);
        electron.ipcRenderer.removeListener('toggle-overlay-visibility', this.onVisibilityChange);
    }
})
export default class OverlayView extends Vue {
    router = useRouter();

    champion: IChampion;

    isDataReady = false;
    isVisible = false;

    currentBuild: IBuild | null = null;

    setChampion(name: string, buildName: string) {
        const champions = championsJSON.champions as IChampion[];
        this.champion = champions.find(ch => ch['name'] === name) as IChampion;

        if (!this.champion.builds) {
            this.champion.builds = [];
        }

        this.champion.builds.forEach(buildByRole => {
           buildByRole.builds.forEach(build => {
               if (build.internalName === buildName) {
                   this.currentBuild = build;
               }
           })
        });

        this.isDataReady = true;

        this.$forceUpdate();
    }

    getSkillIcon(skill: string) {
        return getSkillIcon(this.champion.name, skill);
    }

    setupOverlay() {
        electron.ipcRenderer.once('toggle-overlay-event', this.onToggleEvent);
        electron.ipcRenderer.on('toggle-overlay-visibility', this.onVisibilityChange);
    }

    onToggleEvent() {
        this.isVisible = true;

        this.router.push({
            name: 'champion',
            params: {
                name: "twinblast"
            },
            query: {
                build: this.currentBuild?.internalName
            }
        });

        electron.ipcRenderer.send('disable-overlay-mode', '');

        document.body.style.removeProperty('background')
        document.body.classList.remove('overlay');
    }

    onVisibilityChange() {
        this.isVisible = !this.isVisible;

        this.$forceUpdate();
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

.champions {
    display: flex;
    flex-direction: column;

    .champion {
    }
}

.role-icon {
    width: 32px;
    height: 32px;
}

.side {
    display: flex;
    flex-direction: column;


    &:first-child {
        width: 35%;
    }
}

.background {
    width: fit-content;
    position: fixed;
    filter: blur(0px);
    opacity: 0.1;
    top: 0;
}

.tabs {
    margin-top: 32px;
}

.role-item {
    display: flex;
    align-items: center;

    img {
        width: 32px;
        margin-right: 8px;
    }
}

.empty-builds {
    display: flex;
    margin-top: 64px;

    span {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        width: 100%;
    }
}

.champion-overlay {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;

    border-top-right-radius: 12px;
    border-bottm-right-radius: 12px;
    overflow: hidden;

    background: rgb(24 26 32 / 50%);

    display: flex;
    flex-direction: column;

    padding: 16px;
}

.build-items-wrapper {
    display: flex;
    flex-direction: column;

    margin-bottom: 16px;

    > span {
        font-weight: bold;
        font-size: 12px;
        margin-bottom: 8px;
    }

    .build-items {
        display: flex;
        flex-wrap: wrap;

        margin-top: -8px;
        margin-left: -8px;

        width: 82%;

        .pi-angle-right {
            display: flex;
            align-items: center;
            justify-content: center;

            margin-top: 8px;
            margin-left: 8px;
        }

        > div {
            min-width: 32px;
            width: 32px;
            height: 32px;

            margin-top: 8px;
            margin-left: 8px;
        }

        .game-item {
            border-radius: 8px;
            background: rgb(24 26 32 / 90%);
        }

        .karma {
            width: 32px;

            &:first-child {
                margin-right: 8px;
            }
        }
    }
}

.skills-order {
    display: flex;
    flex-direction: column;

    margin-top: auto;

    .skills {
        display: flex;

        margin-left: 28px;
        margin-bottom: 4px;

        img {
            &:not(:first-child) {
                margin-left: 4px;
            }

            width: 24px;
        }
    }

    .order {
        display: flex;

        font-size: 12px;

        margin-bottom: 4px;

        > span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            text-align: center;
        }

        .order-cell {
            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 12px;

            width: 24px;
            height: 24px;
            background: #0E1015;
            border-radius: 4px;
            text-align: center;

            margin-left: 4px;
        }
    }
}

.title-wrapper {
    justify-content: space-between;

    .title-part {
        display: flex;

        &:last-child {
            flex-direction: column;

            > div {
                display: flex;
            }

            span {
                margin-top: 10px;
                text-align: end;
                margin-bottom: 4px;
            }
        }
    }
}

.counter-pick-icon {
    width: 48px;
    height: 48px;

    border-radius: 8px;

    cursor: pointer;

    &:not(:first-child) {
        margin-left: 8px;
    }
}

</style>

<style lang="scss">
.champion-tabs {
    .p-tabview-panels {
        margin-top: 16px;
        background: transparent;
        padding: 0;
    }
}
</style>
