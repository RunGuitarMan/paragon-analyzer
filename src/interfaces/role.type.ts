import {getRoleIcon} from "../utils/utils";

export enum Role {
    Jungle = "Jungle",
    Mid = "Mid",
    Adc = "Adc",
    Support = "Support",
    Top = "Top"
}

export interface RoleItem {
    role: Role;
    name: string;
    icon: string;
}

export const roles: RoleItem[] = [
    {
        role: Role.Jungle,
        name: "Лес",
        icon: getRoleIcon(Role.Jungle)
    },
    {
        role: Role.Mid,
        name: "Мид",
        icon: getRoleIcon(Role.Mid)
    },
    {
        role: Role.Adc,
        name: "Адк",
        icon: getRoleIcon(Role.Adc)
    },
    {
        role: Role.Support,
        name: "Поддержка",
        icon: getRoleIcon(Role.Support)
    },
    {
        role: Role.Top,
        name: "Топ",
        icon: getRoleIcon(Role.Top)
    }
]