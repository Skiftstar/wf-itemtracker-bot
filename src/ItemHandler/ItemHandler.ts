import { readFileSync, writeFileSync } from "fs"
import { Categories, SavedItems } from "../Types/Types"
import { pushChanges } from "../GitHandler/GitHandler"

const craftedItems: SavedItems = JSON.parse(readFileSync('./data/crafted.json', 'utf8'))
const completedItems: SavedItems = JSON.parse(readFileSync('./data/completed.json', 'utf8'))

const itemCategoryMap = new Map<string, Categories>()

enum StatusType {
    'crafted',
    'finished'
}

export const getStatus = (itemName: string, status: StatusType) => {
    itemName = itemName.toLowerCase()

    let itemContainer;
    if (status === StatusType.crafted) itemContainer = craftedItems
    else itemContainer = completedItems

    const category = itemCategoryMap.get(itemName)
    return itemContainer[category!].includes(itemName)
}

export const addItem = (itemName: string, status: StatusType) => {
    itemName = itemName.toLowerCase()

    let itemContainer;
    if (status === StatusType.crafted) itemContainer = craftedItems
    else itemContainer = completedItems

    const category = itemCategoryMap.get(itemName)
    itemContainer[category!].push(itemName)
    writeFile(status)
}

export const removeItem = (itemName: string, status: StatusType) => {
    itemName = itemName.toLowerCase()

    let itemContainer;
    if (status === StatusType.crafted) itemContainer = craftedItems
    else itemContainer = completedItems
    
    const category = itemCategoryMap.get(itemName)
    itemContainer[category!] = itemContainer[category!].filter(item => item.toLowerCase() !== itemName)
    writeFile(status)
}

const writeFile = (status: StatusType) => {
    let itemContainer;
    let fileName;
    if (status === StatusType.crafted) {
        itemContainer = craftedItems
        fileName = './crafted.json'
    }
    else {
        itemContainer = completedItems
        fileName = './completed.json'
    }

    writeFileSync(fileName, JSON.stringify(itemContainer).replaceAll(",", ",\n"))
    pushChanges(`Changed File ${fileName}`)
}