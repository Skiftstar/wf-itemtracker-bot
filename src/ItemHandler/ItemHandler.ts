import { readFileSync, writeFileSync } from "fs"
import { SavedItems } from "../Types/Types"
import { pushChanges } from "../GitHandler/GitHandler"
import { beautifyJSON } from "../Util/Util"

const craftedItems: SavedItems = JSON.parse(readFileSync('./data/crafted.json', 'utf8'))
const completedItems: SavedItems = JSON.parse(readFileSync('./data/completed.json', 'utf8'))

export const categoryToTypeMapper: { [key:string]: string } = {
    "Primary": "primaries",
    "Secondary": "secondaries",
    "Melee": "melees",
    "Warframes": "warframes",
    "Archwing": "archwings",
    "Arch-Gun": "archguns",
    "Arch-Melee": "archmelees",
    "Pets": "companions",
    "Sentinels": "companions"
}

export enum StatusType {
    'crafted',
    'finished'
}

export const getStatus = (itemName: string, category: string, status: StatusType) => {
    itemName = itemName.toLowerCase()

    category = categoryToTypeMapper[category]

    let itemContainer;

    if (status === StatusType.crafted) itemContainer = craftedItems
    else itemContainer = completedItems

    return itemContainer[category!].includes(itemName)
}

export const doneOrCrafted = (itemName: string, category: string) => {
    return getStatus(itemName, category, StatusType.crafted) || getStatus(itemName, category, StatusType.finished)
}

export const addItem = (itemName: string, category: string, status: StatusType): boolean => {
    itemName = itemName.toLowerCase()
    const mappedCategory = categoryToTypeMapper[category]

    let itemContainer;
    if (status === StatusType.crafted) {
        if (doneOrCrafted(itemName, category)) {
            return false
        }
        itemContainer = craftedItems
    } else {
        if (getStatus(itemName, category, StatusType.finished)) {
            return false
        }
        itemContainer = completedItems
    }

    itemContainer[mappedCategory!].push(itemName)
    writeFile(status)

    return true;
}

export const removeItem = (itemName: string, category: string, status: StatusType) => {
    itemName = itemName.toLowerCase()
    category = categoryToTypeMapper[category]

    let itemContainer;
    if (status === StatusType.crafted) itemContainer = craftedItems
    else itemContainer = completedItems
    
    itemContainer[category!] = itemContainer[category!].filter(item => item.toLowerCase() !== itemName)
    writeFile(status)
}

const writeFile = (status: StatusType) => {
    let itemContainer;
    let fileName;
    if (status === StatusType.crafted) {
        itemContainer = craftedItems
        fileName = './data/crafted.json'
    }
    else {
        itemContainer = completedItems
        fileName = './data/completed.json'
    }

    writeFileSync(fileName, beautifyJSON(JSON.stringify(itemContainer)))
    pushChanges(`Changed File ${fileName}`)
}