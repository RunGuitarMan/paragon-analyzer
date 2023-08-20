<template>
<div class="page-wrapper champion-overlay" v-if="champion">
    <div class="build-items-wrapper" v-if="currentBuild.items?.length">
        <span>Порядок сборки билда</span>
        <div class="build-items main">
            <game-item v-for="(item, index) in currentBuild.items" :name="item" :index="index"></game-item>
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

@Options({
    components: {GameItem},
    beforeMount() {
        const route = useRoute();
        const name = route.params.name;
        
        this.setChampion(name);
    }
})
export default class OverlayView extends Vue {
    
    
    router = useRouter();
    
    champion: IChampion;
    
    isDataReady = false;
    
    championRole: RoleItem ;
    
    roles: RoleItem[];
    
    builds: IBuild[] = [];
    
    currentBuild: IBuild | null = null;
    
    setChampion(name: string) {
        this.roles = roles;
        
        const champions = championsJSON.champions as IChampion[];
        
        this.champion = champions.find(ch => ch['name'] === name) as IChampion;
        this.championRole = roles.find(r => r.role === this.champion.role) as RoleItem;
        
        if (!this.champion.builds) {
            this.champion.builds = [];
        }
        
        this.builds = this.champion.builds.find(b => b.role === this.championRole.role)?.builds ?? [];
        this.currentBuild = this.builds.length > 0 ? this.builds[0] : null;
        
        this.isDataReady = true;
        
        this.$forceUpdate();
    }
    
    getPortraitImage() {
        return `/src/assets/images/champions/${this.champion?.name}/body.png`;
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
    
    onRoleChanged(event) {
        this.builds = this.champion.builds.find(b => b.role === event.value.role)?.builds ?? [];
    }
    
    goBack() {
        this.router.back();
    }
    
    openChampion(name) {
        this.router.push({
            name: 'champion',
            params: {
                name
            }
        });
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
    position: fixed;
    right: 0;
    top: 0;
    
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
