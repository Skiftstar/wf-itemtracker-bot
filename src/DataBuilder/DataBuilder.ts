import { EmbedBuilder } from "discord.js"
import { fetchData } from "../Axios/Axios"
import { bulkDelete, getChannelById, sendEmbed, sendError } from "../DiscordBot/Bot"
import { Item, ItemArrays, ResponseItem } from "../Types/Types"
import { getConfigValue } from "../Config/Config"
import { StatusType, getStatus } from "../ItemHandler/ItemHandler"
import { firstLetterUpper } from "../Util/Util"

export interface DataResponse {
    arrays: ItemArrays
    componentsMap: Map<string, ResponseItem[]>
    nameToItemMap: Map<string, ResponseItem>
}

export const loadInitialData = async (): Promise<DataResponse> => {
    let arrays: ItemArrays = { primaries: [], secondaries: [], melees: [], warframes: [], archwings: [], archguns: [], archmelees: [], companions: [] }
    const componentsMap = new Map<string, ResponseItem[]>()
    const nameToItemMap = new Map<string, ResponseItem>()
  
    const response = await fetchData()
    if (response.status !== 200) {
        sendError("Fetching Data Failed, see logs. Status: " + response.status, response.data)
        return { arrays, componentsMap, nameToItemMap }
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
            componentsMap.set(item.name.toLowerCase(), item.components)
        }

        nameToItemMap.set(item.name.toLowerCase(), item);

        categoryMapper.forEach(category => {
            if (category.itemCategories.includes(item.category)) {
                category.arr.push({ data: item })
            }
        })
    })
    return { arrays, componentsMap, nameToItemMap }
  }

export const buildEmbeds = (items: ItemArrays) => {
    let deplayMultiplier = 1;
    const initialDelay = 100;
    const delayBetweenEmbeds = getConfigValue("delayBetweenEmbeds")
    for (const type in items) {
        const embed = generateEmbed(items[type])
        const channelId = getConfigValue(`weaponChannels.${type}`)
        const channel = getChannelById(channelId)
        bulkDelete(channel)
        setTimeout(() => {
            sendEmbed(channel, embed)
        }, initialDelay + delayBetweenEmbeds * deplayMultiplier)
        deplayMultiplier++
    }
}

function generateEmbed(items: Item[]) {
    const arrays: { [key: string]: string[] } = { primes: [], prismas: [], kuvas: [], tenets: [], wraiths: [], vandals: [], normals: []}
    const variants = [
        { identifier: "Prime", location: "end", array: arrays.primes },
        { identifier: "Prisma", location: "start", array: arrays.prismas },
        { identifier: "Kuva", location: "start", array: arrays.kuvas },
        { identifier: "Tenet", location: "start", array: arrays.tenets },
        { identifier: "Wraith", location: "end", array: arrays.wraiths },
        { identifier: "Vandal", location: "end", array: arrays.vandals },
    ]

    items.forEach(item => {
        let itemName = item.data.name
        const words = itemName.split(" ")

        if (getStatus(itemName, item.data.category, StatusType.finished)) {
            return;
        }

        if (getStatus(itemName, item.data.category, StatusType.crafted)) {
            itemName += getConfigValue("craftedFlair")
        }

        let foundFittingVariant = false;

        for (const variant of variants) {
            const compare = variant.location === "end" ? words[words.length - 1] : words[0]

            if (compare.toLocaleLowerCase() == variant.identifier.toLocaleLowerCase()) {
                foundFittingVariant = true;
                variant.array.push(itemName)
                break;
            }
        }
        if (!foundFittingVariant) {
            arrays.normals.push(itemName)
        }
    })

    let embed = new EmbedBuilder()
        .setTitle("Items")
        .setColor('#FF0000')
        .setDescription('These items still need to be leveled up to max.\n\n')

    const maxItemsInField = getConfigValue("maxItemsInField")

    for (const variant in arrays) {
        if (arrays[variant].length === 0) continue;

        let fieldAmount = 0;
        const fieldNameTempl = firstLetterUpper(variant)

        while (arrays[variant].length > maxItemsInField) {
            let fieldName = fieldNameTempl;
            if (fieldAmount > 0) fieldName += " " + ++fieldAmount

            embed.addFields({name: fieldName, value: arrays[variant].slice(0, maxItemsInField).join("\n")})
            
            arrays[variant] = arrays[variant].slice(maxItemsInField)
        }
        let fieldName = fieldNameTempl
        if (fieldAmount > 0) fieldName += " " + fieldAmount

        embed.addFields({name: fieldName, value: arrays[variant].join("\n")})
    }

    return embed;
}