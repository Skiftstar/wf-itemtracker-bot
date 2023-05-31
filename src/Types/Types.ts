export interface ResponseItem {
    category: string,
    uniqueName: string,
    components?: ResponseItem[],
    name: string,
    wikiaThumbnail: string,
    drops?: DropItem[],
    bpCost?: number,
    itemCount: number
}

export interface DropItem {
    location: string,
    rarity: string,
    chance: number
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

export enum GamePlatform {
    pc,
    ps4,
    xb1,
    swi
}