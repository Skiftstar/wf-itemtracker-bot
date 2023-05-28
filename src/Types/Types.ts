export interface ResponseItem {
    category: string,
    uniqueName: string,
    components: ResponseItem[],
    name: string
}

export interface Item {
    data: ResponseItem
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