<template>
    <div class="layout-toolbar">
        <div class="drag"></div>
        <div class="system-buttons">
            <i class="pi pi-minus" @click="minimize()"></i>
            <i class="pi pi-times" @click="close()"></i>
        </div>
    </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";

const electron = require("electron");

@Options({
    components: {}
})
export default class AppTopBar extends Vue {

    minimize() {
        electron.ipcRenderer.send('minimize', '')
    }
    
    close() {
        electron.ipcRenderer.send('close', '')
    }
    
}

</script>

<style lang="scss" scoped>

.layout-toolbar {
    position: fixed;
    z-index: 1000;

    background: #0d0e10;



    display: flex;
    align-items: center;
    justify-content: flex-end;

    height: 40px;
    width: 100%;

    left: 0;
    top: 0;

    border-bottom: solid 1px #383942;
    
    > .drag {
        width: 100%;
        height: 100%;
        
        -webkit-app-region: drag;
    }
    
    .system-buttons {
        display: flex;
        
        .pi {
            display: flex;
            justify-content: center;
            align-items: center;
            
            color: var(--text-color);
            
            height: 40px;
            width: 40px;
            
            cursor: pointer;
            
            &:hover {
                background: #8080801a;
                color: white;
            }
            
            &:not(:first-child) {
                margin-left: 8px;
            }
        }
    }
}



</style>
