import {Role} from "./role.type";
import {IBuildByRole} from "./IBuild";

export interface IChampion {
    name: string;
    internalName: string;
    icon: string;
    role: Role;
    roleIcon: string;
    tier: number;
    builds: IBuildByRole[];
    counterPicks: string[];
}