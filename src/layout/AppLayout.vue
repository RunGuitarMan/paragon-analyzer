<template>
<div class="layout-wrapper">
    <app-top-bar></app-top-bar>
    <app-sidebar></app-sidebar>
    <div class="layout-main-container">
        <div class="layout-main">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :key="$route.fullPath" :is="Component"/>
                </transition>
            </router-view>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import {Options, Vue} from 'vue-class-component';
import AppTopBar from "./AppTopBar.vue";
import AppSidebar from "./AppSidebar.vue";

@Options({
    components: {AppSidebar, AppTopBar},
})
export default class AppLayout extends Vue {
}

</script>

<style lang="scss" scoped>


.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.layout-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
}

.layout-main-container {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    margin-top: 40px;
    margin-left: 80px;
    
    height: calc(100% - 40px);
    width: 100%;
}

.layout-main {
    flex: 1 1 auto;
    
    overflow: auto;
    
    padding: 32px 152px;
}

</style>
