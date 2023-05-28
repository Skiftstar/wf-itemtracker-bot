export interface ResponseItem {
    category: string,
    uniqueName: string,
    components: ResponseItem[]
}

export interface Item {
    data: ResponseItem,
    crafted: boolean,
    finished: boolean
}

export interface ItemArrays {
    [key: string]: Item[]
}

export interface SavedItems {
    [category: string]: string[]
}

export enum Categories {
    primaries,
    secondaries,
    melees,
    warframes,
    archwings,
    archguns,
    archmelees,
    companions
}