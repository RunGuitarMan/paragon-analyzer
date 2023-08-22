<template>
<div class="page-wrapper" v-if="champion">
    <img class="background" :src="getPortraitImage()">
    <div class="page-content">
        <div class="go-back" @click="goBack()">
            <i class="pi pi-arrow-left"></i>
            <span>Назад</span>
        </div>
        <div class="title-wrapper">
            <div class="title-part">
                <img class="title-icon" :src="getChampionIcon(champion.name)" alt="champion-logo">
                <h1 class="title-name">{{ champion.internalName }}</h1>
            </div>
            <div class="title-part">
                <span>Контрпики</span>
                <div>
                    <img class="counter-pick-icon" :src="getChampionIcon(item)" v-for="(item, index) in champion.counterPicks" alt="counter-pick-icon" @click="openChampion(item)">
                </div>
            </div>
        </div>
        <TabView class="tabs champion-tabs">
            <TabPanel header="Сводка">
                <div>
                    <Dropdown v-model="championRole" :options="roles" optionLabel="name" @change="onRoleChanged">
                        <template #value="slotProps">
                            <div class="role-item" v-if="slotProps.value">
                                <img :src="championRole.icon" alt=""/>
                                <span>{{ championRole.name }}</span>
                            </div>
                            <span v-else>
                                ds
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="role-item">
                                <img :src="slotProps.option.icon" alt="" />
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                <div class="builds-wrapper" v-if="builds.length">
                    <div class="side">
                        <span class="builds-title">Билды по стилю игры</span>
                        <div class="build-title" :class="{ current: currentBuild?.internalName === build.internalName }" v-for="(build, index) in builds" @click="currentBuild = build">
                            <span>{{ build.internalName }}</span>
                            <span>{{ build.creator }}</span>
                        </div>
                    </div>
                    <div class="side" v-if="currentBuild">
                        <div class="build-items-wrapper" v-if="currentBuild.items?.length">
                            <span>Порядок сборки билда</span>
                            <div class="build-items main">
                                <game-item v-for="(item, index) in currentBuild.items" :name="item" :index="index"></game-item>
                            </div>
                        </div>
                        <div class="build-items-wrapper" v-if="currentBuild.coreItems?.length">
                            <span>Порядок покупки основных предметов</span>
                            <div class="build-items">
                                <template v-for="(item, index) in currentBuild.coreItems">
                                    <game-item :name="item"></game-item>
                                    <i class="pi pi-angle-right" v-if="index !== currentBuild.coreItems.length - 1"></i>
                                </template>
                             
                            </div>
                        </div>
                        <div class="build-items-wrapper" v-if="currentBuild.situationalItems?.length">
                            <span>Ситуативные предметы</span>
                            <div class="build-items">
                                <game-item v-for="(item, index) in currentBuild.situationalItems" :name="item"></game-item>
                            </div>
                        </div>
                        <div class="build-items-wrapper" v-if="currentBuild.karmas?.length">
                            <span>Умения</span>
                            <div class="build-items">
                                <img class="karma" :src="getKarmaIcon(karma)" v-for="(karma, index) in currentBuild.karmas" :alt="karma">
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
                </div>
                <div v-else class="empty-builds">
                    <span>Отсутсвуют билды для текущей роли</span>
                </div>
            </TabPanel>
            <TabPanel header="Умения">
            </TabPanel>
        </TabView>
    </div>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import {useRoute, useRouter} from "vue-router";

import championsJSON from '../assets/staticDev/champions.json';
import {IChampion} from "../interfaces/IChampion";

import {getChampionIcon, getKarmaIcon, getPortraitImage, getRoleIcon, getSkillIcon} from "../utils/utils";
import {Role, RoleItem, roles} from "../interfaces/role.type";
import GameItem from "../components/GameItem.vue";
import {IBuild} from "../interfaces/IBuild";

import overlay from "electron-overlay-window"
import electron from "electron";
import createOverlayStore from "../stores/overlay.store";

@Options({
    components: {GameItem},
    beforeMount() {
        const route = useRoute();
        const name = route.params.name;
        const build = route.query.build;
        
        this.setChampion(name, build);

        this.setupOverlay();
    },
    beforeUnmount() {
        electron.ipcRenderer.removeListener('toggle-overlay-event', this.onToggleEvent);
    }
})
export default class ChampionView extends Vue {
    router = useRouter();
    champion: IChampion;
    
    isDataReady = false;
    
    championRole: RoleItem ;
    
    roles: RoleItem[];
    
    builds: IBuild[] = [];
    
    currentBuild: IBuild | null = null;
    
    setChampion(name: string, buildName: string) {
        this.roles = roles;
        
        const champions = championsJSON.champions as IChampion[];
        
        this.champion = champions.find(ch => ch['name'] === name) as IChampion;
        this.championRole = roles.find(r => r.role === this.champion.role) as RoleItem;
        
        if (!this.champion.builds) {
            this.champion.builds = [];
        }
        
        this.builds = this.champion.builds.find(b => b.role === this.championRole.role)?.builds ?? [];
        if (buildName) {
            this.currentBuild = this.getBuildByName(buildName);
        } else {
            this.currentBuild = this.builds.length > 0 ? this.builds[0] : null;
        }

        this.isDataReady = true;
        
        this.$forceUpdate();
    }

    getBuildByName(buildName: string) {
        let build = null;
        this.champion.builds.forEach(buildByRole => {
            buildByRole.builds.forEach(b => {
                if (b.internalName === buildName) {
                    build = b;
                }
            })
        });

        return build;
    }

    getPortraitImage() {
        return getPortraitImage(this.champion?.name);
    }
    
    getChampionIcon(name: string) {
        return getChampionIcon(name);
    }
    
    getSkillIcon(skill: string) {
        return getSkillIcon(this.champion.name, skill);
    }
    
    getKarmaIcon(karma: string) {
        return getKarmaIcon(karma);
    }
    
    onRoleChanged(event: any) {
        this.builds = this.champion.builds.find(b => b.role === event.value.role)?.builds ?? [];
    }
    
    goBack() {
        this.router.push('/champions');
    }
    
    openChampion(name: string) {
        this.router.push({
            name: 'champion',
            params: {
                name
            }
        });
    }

    setupOverlay() {
        electron.ipcRenderer.on('toggle-overlay-event',  this.onToggleEvent);
    }

    onToggleEvent() {
        if (!this.currentBuild)
            return;

        this.router.push({
            name: 'overlay',
            params: {
                name: this.champion.name,
                build: this.currentBuild?.internalName
            },
            query: {
                build: this.currentBuild?.internalName
            }
        });

        electron.ipcRenderer.send('enable-overlay-mode', '');

        document.body.style.background = 'transparent';
        document.body.classList.add('overlay');
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

.builds-wrapper {
    display: flex;
    margin-top: 16px;
    
    .builds-title {
        margin: 16px 0 0px 32px;
        font-size: 14px;
        color: rgb(153, 156, 163);
    }
    
    .side {
        &:first-child {
            width: 25%;
            background: #13151B;
        }
        &:last-child {
            width: 75%;
            background: #181A20;
        }
    }
    
    .build-title {
        padding: 8px 32px;
        
        display: flex;
        flex-direction: column;
        
        cursor: pointer;
        
        &.current {
            border-left: #30D9D3 1px solid;
            background: #181A20;
        }
        
        &:first-child {
            padding-top: 0;
        }
        
        > span {
            &:first-child {
                font-weight: bold;
            }
            &:last-child {
                font-size: 12px;
                color:  rgb(153, 156, 163);
            }
        }
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

.build-items-wrapper {
    display: flex;
    flex-direction: column;
    
    padding: 16px;
    
    > span {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .build-items {
        display: flex;
        
        .pi-angle-right {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;
        }
        
        &.main {
            > div {
                width: 48px;
                height: 48px;
            }
        }
        
        > div {
            width: 32px;
            height: 32px;
            
            &:not(:first-child) {
                margin-left: 8px;
            }
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
    padding: 16px;
    
    .skills {
        display: flex;
        flex-direction: column;
        
        margin-top: 28px;
        margin-right: 4px;
        
        img {
            &:not(:first-child) {
                margin-top: 4px;
            }
            
            width: 24px;
        }
    }
    
    .order {
        display: flex;
        flex-direction: column;
        
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
            
            width: 24px;
            height: 24px;
            background: #0E1015;
            border-radius: 4px;
            text-align: center;
            
            margin-left: 4px;
            
            &:not(:first-child) {
                margin-top: 4px;
            }
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
