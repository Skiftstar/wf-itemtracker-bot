import { fetchData } from "../Axios/Axios"
import { sendError } from "../DiscordBot/Bot"
import { ItemArrays, ResponseItem } from "../Types/Types"

export interface DataResponse {
    arrays: ItemArrays
    componentsMap: Map<string, ResponseItem[]>
}

export const loadInitialData = async (): Promise<DataResponse> => {
    let arrays: ItemArrays = { primaries: [], secondaries: [], melees: [], warframes: [], archwings: [], archguns: [], archmelees: [], companions: [] }
    const componentsMap = new Map<string, ResponseItem[]>()
  
    const response = await fetchData()
    if (response.status !== 200) {
        sendError("Fetching Data Failed, see logs. Status: " + response.status, response.data)
        return { arrays, componentsMap }
    }
    const categoryMapper = [
        { arr: arrays.primaries, itemCategories: ["Primary"] },
        { arr: arrays.secondaries, itemCategories: ["Secondary"] },
        { arr: arrays.melees, itemCategories: ["Melee"] },
        { arr: arrays.warframes, itemCategories: ["Warframes"] },
        { arr: arrays.archwings, itemCategories: ["Archwing"] },
        { arr: arrays.archguns, itemCategories: ["Arch-Gun"] },
        { arr: arrays.archmelees, itemCategories: ["Arch-Melee"] },
        { arr: arrays.companions, itemCategories: ["Pets", "Sentinels"] }
    ]
    const toSkip = ['Glyphs', 'Sigils', 'Enemy', 'Quests', 'Mods', 'Fish', 'Skins', 'Node', 'Relics']
    const categories: string[] = []

    response.data.forEach((item: ResponseItem) => {
        if (!categories.includes(item.category)) {
            categories.push(item.category)
        }

        if (toSkip.includes(item.category)) {
            return
        }

        if (item.components) {
            componentsMap.set(item.uniqueName, item.components)
        }

        categoryMapper.forEach(category => {
            if (category.itemCategories.includes(item.category)) {
                category.arr.push({ data: item, crafted: false, finished: false })
            }
        })
    })
    return { arrays, componentsMap }
  }
  