import {defineStore} from "pinia";
import axios from "axios";
import {IChampion} from "../interfaces/IChampion";

interface IChampionsStoreState {
    items: IChampion[]
}

const championsStore = defineStore('champions-store', {
    state: (): IChampionsStoreState => ({
        items: []
    }),
    actions: {
        async setup() {
            if (this.items.length !== 0)
                return;

            this.items = [];
            const response = await axios.get("https://paragon-analyzer.storage.yandexcloud.net/champions.json");
            response?.data?.champions.forEach((item: IChampion) => {
                this.items.push(item);
            })
        },
        get(championName: string): IChampion {
            return this.items.find(ch => ch.name === championName);
        }
    }
});

const createChampionsStore = () => championsStore();

export default createChampionsStore;