import {defineStore} from "pinia";
import {IItem} from "../interfaces/IItem";

import itemsJSON from "../assets/staticDev/it2ems.json";
import axios from "axios";

interface IItemsStore {
    items: IItem[]
}

// @ts-ignore
const itemsStore = defineStore('items-store', {
    state: (): IItemsStore => ({
        items: []
    }),
    actions: {
        async setup() {
            if (this.items.length !== 0)
                return;

            const response = await axios.get("https://paragon-analyzer.storage.yandexcloud.net/items.json");
            response?.data?.items.forEach((item: IItem) => {
                this.items.push(item);
            })
        },
        getItem(itemName: string): IItem {
            if (this.items.length === 0) {
                this.setup();
            }

            return this.items.find(item => item.name === itemName) as IItem;
        }
    }
});

const createItemsStore = () => itemsStore();

export default createItemsStore;