import {Role} from "../interfaces/role.type";

export const getChampionIcon = (name: string) => {
    return new URL(`/src/assets/images/champions/${name}/logo.png`, import.meta.url).href
}
export const getRoleIcon = (role: Role) => {
    return new URL(`/src/assets/images/role-icons/${role}.png`, import.meta.url).href
}

export const getPortraitImage = (champion: string) => {
    return new URL(`/src/assets/images/champions/${champion}/body.png`, import.meta.url).href
}

export const getSkillIcon = (champion: string, skill: string) => {
    return new URL(`/src/assets/images/champion-skills/${champion}/${skill}.png`, import.meta.url).href
}

export const getItemIcon = (item: string) => {
    return new URL(`/src/assets/images/items/${item}.png`, import.meta.url).href
}

export const getKarmaIcon = (karma: string) => {
    return new URL(`/src/assets/images/karma/${karma}.png`, import.meta.url).href
}
