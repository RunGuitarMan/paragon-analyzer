import {defineStore} from "pinia";
import {IItem} from "../interfaces/IItem";

import itemsJSON from "../assets/static/items.json";

interface IItemsStore {
    items: IItem[]
}

// @ts-ignore
const itemsStore = defineStore('app', {
    state: (): IItemsStore => ({
        items: []
    }),
    actions: {
        setup() {
            itemsJSON.items.forEach(item => {
                item["icon"] = `/src/assets/images/items/${item.name}.png`;

                this.items.push(item as IItem);
            })
        },
        getItem(itemName: string): IItem {
            if (this.items.length === 0) {
                this.setup();
            }

            return this.items.find(item => item.name === itemName);
        }
    }
});

const createItemsStore = () => itemsStore();

export default createItemsStore;