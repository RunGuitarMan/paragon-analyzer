<template>
<div class="game-item">
    <img :src="item.icon" alt="item"  v-tooltip="tooltipValue">
    <span class="index" v-if="index == 0">Стартовое</span>
    <span class="index" v-if="index > 0">{{ index }} - e</span>
</div>
</template>

<script lang="ts">

import {Options, prop, Vue} from "vue-class-component";
import createItemsStore from "../stores/items.store";
import {IItem} from "../interfaces/IItem";
import {getItemIcon} from "../utils/utils";

class Props {
    name = prop({
        type: String,
        required: true
    })
    index = prop({
        type: Number,
        required: false
    })
}

@Options({
    beforeMount() {
        this.setup();
    }
})
export default class GameItem extends Vue.with(Props) {
    
    itemsStore = createItemsStore();
    
    item: IItem;
    
    tooltipValue = {}
    
    setup() {
        this.item = this.itemsStore.getItem(this.name);
        
        const tooltip = this.createTooltip();
        
        this.tooltipValue = {
            value: tooltip,
            escape: true,
            class: "item-tooltip"
        }
    }
    
    createTooltip() {
        let tooltip = `
        <div class="title-wrapper">
            <img src="${getItemIcon(this.item.name)}" alt="item">
            <div>
                <span>${this.item.internalName}</span>
                <span>Cтоимость: <span class="price">${this.item.price}</span></span>
            </div>
        </div>
        <div class="item-description">
`;
        
        this.item.params?.forEach(param => {
            tooltip += `<span><span class="param-value">${param.value}</span> ${param.name}</span>`;
        });
        
        tooltip += `
            <span class="description">${this.item.description}</span>
        </div>
        
        `;
        
        return tooltip;
    }
}

</script>


<style lang="scss" scoped>

.game-item {
    position: relative;
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    > img {
        width: 100%;
    }
    
    .index {
        position: absolute;
        bottom: -10px;
        padding: 0 4px;
        background: #0d0e10;
        border-radius: 4px;
        
        color: rgb(153, 156, 163);
        
        font-size: 12px;
    }
}

</style>

<style lang="scss">

.p-tooltip.p-component.item-tooltip {
    display: flex !important;
    flex-direction: column;
    

    .p-tooltip-text {
        padding: 16px;
        white-space: inherit;
        width: fit-content;
        
        min-width: 500px;
        
        background: #0d0e10;
    }
    
    .title-wrapper {
        display: flex;
        
        border-bottom: gray 1px solid;
        padding-bottom: 6px;
        
        margin-bottom: 24px;
        
        > img {
            width: 48px;
            margin-right: 16px;
        }
        
        > div {
            display: flex;
            flex-direction: column;
            
            font-weight: bold;
            text-wrap: nowrap;
            
            .price {
                color: #D7B168;
            }
        }
        

    }
    
    .item-description {
        display: flex;
        flex-direction: column;
        
        > span {
            &:not(.description) {
                text-wrap: nowrap;
            }
            
            &.description {
                margin-top: 16px;
            }
            
            .param-value {
                color: #D7B168;
            }
        }
    }
}

</style>
