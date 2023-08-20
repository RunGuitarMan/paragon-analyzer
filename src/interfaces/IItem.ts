export interface IItem {
    name: string;
    internalName: string;
    description: string;
    icon: string;
    price: number;
    params: IItemParam[];
}

export interface IItemParam {
    name: string;
    value: string;
}