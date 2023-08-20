import {Role} from "./role.type";

export interface IBuildByRole {
    role: Role;
    builds: IBuild[];
}

export interface IBuild {
    internalName: string;
    creator: string;
    items: string[];
    coreItems: string[];
    situationalItems: string[];
    skillsOrder: string[];
    karmas: string[];
}