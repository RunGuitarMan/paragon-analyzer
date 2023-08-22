<template>
<div class="page-wrapper">
    <img class="background" src="../assets/images/backgrounds/1.png" alt="background">
    <div class="title-wrapper">
        <i class="pi pi-book"></i>
        <h1 class="title-name">Чемпионы</h1>
    </div>
    <div class="page-content">
        <div class="champions">
            <div class="table-wrapper" v-if="isDataReady">
                <DataTable :value="champions" v-model:selection="champion" selectionMode="single" dataKey="name"
                           filterDisplay="row" stripedRows
                           size="normal"
                           @rowSelect="onChampionSelected" :scrollable="true" v-model:filters="filter" data-key="name"
                           scrollHeight="flex">
                    <template #header>
                        <div class="table-header">
                            <InputText v-model="filter['global'].value" placeholder="Поиск"/>
                        </div>
                    </template>
                    <Column field="tier" header="Тир" sortable>
                        <template #body="{data, slotProps}">
                            <span class="tier"
                                  :style="{ color: getTierColor(data.tier) }">{{ getTierChar(data.tier) }}</span>
                        </template>
                    </Column>
                    <Column header="">
                        <template #body="{data, slotProps}">
                            <img class="champion-icon" :src="getChampionIcon(data.name)">
                        </template>
                    </Column>
                    <Column field="internalName" header="Чемпион" sortable></Column>
                    <Column field="role" header="Роль" sortable :showFilterMenu="false">
                        <template #body="{data, slotProps}">
                            <img class="role-icon" :src="getRoleIcon(data.role)" alt="role-icon">
                        </template>
                        <template #filter="{filterModel,filterCallback}">
                            <Dropdown v-model="filterModel.value" :options="roles" optionLabel="name" optionValue="role"
                                      @change="filterCallback()" showClear>
                                <template #value="slotProps">
                                    <div class="role-item" v-if="slotProps.value">
                                        <img :src="getRoleIcon(filterModel.value)" alt=""/>
                                        <span>{{ filterModel.value }}</span>
                                    </div>
                                    <span v-else>Any</span>
                                </template>
                                <template #option="slotProps">
                                    <div class="role-item">
                                        <img :src="slotProps.option.icon" alt=""/>
                                        <div>{{ slotProps.option.name }}</div>
                                    </div>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="counterPicks" header="Контрпики">
                        <template #body="{data, slotProps}">
                            <img class="counter-pick-icon" :src="getChampionIcon(item)" v-for="(item, index) in data.counterPicks" alt="counter-pick-icon">
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";

import championsJSON from "../assets/static/champions.json";
import {IChampion} from "../interfaces/IChampion";
import {FilterMatchMode} from "primevue/api";
import {Role, RoleItem, roles} from "../interfaces/role.type";
import {useRouter} from "vue-router";
import itemsStore from "../stores/items.store";
import {getChampionIcon, getRoleIcon} from "../utils/utils";
import {IBuildByRole} from "../interfaces/IBuild";

import electron from "electron";
import createOverlayStore from "../stores/overlay.store";
@Options({
    beforeMount() {
        this.initFilter();
        
        this.isDataReady = true;
    }
})
export default class ChampionsView extends Vue {
    
    router = useRouter();
    itemsStore = itemsStore();
    
    champions: IChampion[] = championsJSON.champions;
    champion = null;
    
    filter = {};
    
    roles: RoleItem[];
    
    isDataReady = false;
    
    isOverlayEnabled = false;

    getChampionIcon(name: string) {
        return getChampionIcon(name);
    }
    
    getRoleIcon(role: Role) {
        return getRoleIcon(role);
    }
    
    initFilter() {
        this.roles = roles;
        
        this.filter = {
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'role': {value: null, matchMode: FilterMatchMode.EQUALS}
        }
    }
    
    getTierChar(tier: number): string {
        switch (tier) {
            case 1:
                return "S";
            case 2:
                return "A";
            case 3:
                return "B";
            case 4:
                return "C";
            case 5:
                return "D";
        }
    }
    
    getTierColor(tier: number): string {
        switch (tier) {
            case 1:
                return "#FF7F7F";
            case 2:
                return "#FFBF7F";
            case 3:
                return "#FFDF7F";
            case 4:
                return "#FFDF7F";
            case 5:
                return "#FFFF7F";
        }
    }
    
    onChampionSelected(event) {
        const name = event.data.name;

        this.router.push({
            name: 'champion',
            params: {
                name
            }
        });
    }
    
    getRoleIcon(name: Role) {
        return getRoleIcon(name);
    }
}

</script>

<style lang="scss" scoped>

.champions {
    display: flex;
    flex-direction: column;
    
    .champion {
    }
}

.champion-icon {
    width: 48px;
    height: 48px;
    vertical-align: middle;
    border-radius: 8px;
}

.role-icon {
    width: 32px;
    height: 32px;
    vertical-align: middle;
}

.counter-pick-icon {
    width: 32px;
    height: 32px;
    
    border-radius: 8px;
    
    &:not(:first-child) {
        margin-left: 8px;
    }
}

.tier {
    font-size: 24px;
    margin-left: 4px;
}

.role-item {
    display: flex;
    align-items: center;
    
    img {
        vertical-align: middle;
        width: 32px;
        margin-right: 8px;
    }
}

.background {
    position: fixed;
    
    width: 100%;
    opacity: 0.05;
    height: 100%;
    
    left: 0;
    filter: blur(6px);
    top: 0;
}

</style>