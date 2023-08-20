import {Role} from "../interfaces/role.type";

export const getChampionIcon = (name: string) => {
    return `/src/assets/images/champions/${name}/logo.png`;
}
export const getRoleIcon = (role: Role) => {
    return `/src/assets/images/role-icons/${role}.png`;
}

export const getSkillIcon = (champion: string, skill: string) => {
    return `/src/assets/images/champion-skills/${champion}/${skill}.png`;
}

export const getKarmaIcon = (karma: string) => {
    return `/src/assets/images/karma/${karma}.png`;
}
