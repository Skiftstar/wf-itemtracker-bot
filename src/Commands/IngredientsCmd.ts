import { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { replyEmbed } from "../DiscordBot/Bot";
import { itemArrays } from "..";
import { ResponseItem } from "../Types/Types";
import { doneOrCrafted } from "../ItemHandler/ItemHandler";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ingredients')
		.setDescription("Returns a list of missing ingredients"),
	async execute(interaction: ChatInputCommandInteraction) {
        let items: ResponseItem[] = []

        Object.keys(itemArrays).forEach(type => {
            itemArrays[type].forEach(item => {
                if (doneOrCrafted(item.data.name, item.data.category)) return
                items.push(item.data)
            })
        })

        const list = getIngredientList(items)

		return replyEmbed(interaction, genIngredientEmbed(list))
	},
};

function getIngredientList(items: ResponseItem[]) {
    let ingredientsMap = new Map();

    items.forEach(item => {
        if (item.components) {
            item.components.forEach(component => {
                if (!component.uniqueName.startsWith('/Lotus/Types/Items/')) {
                    return;
                }
                if (ingredientsMap.has(component.name)) {
                    ingredientsMap.set(component.name, ingredientsMap.get(component.name) + component.itemCount)
                } else {
                    ingredientsMap.set(component.name, component.itemCount)
                }
            })
        }
    })

    return ingredientsMap;
}

function genIngredientEmbed(ingredientMap: Map<string, number>, customTitle?: string) {
    const ingredientMapSorted = new Map([...ingredientMap.entries()].sort((a, b) => b[1] - a[1]));

    let embed = new EmbedBuilder()
    embed.setTitle(customTitle ?? "Needed Ingredients")
    embed.setDescription("Shows all needed ingredients (not counting subParts like blades and not counting crafting cost for subparts like systems)")
    embed.setColor(0x00AE86)
    let items = []
    for (const key of ingredientMapSorted.keys()) {
        items.push(`${key} : ${ingredientMap.get(key)}`)
    }
    if (items.length > 30) {
        let index = 1;
        while (items.length > 0) {
            embed.addFields({name: `Ingredients ${index}`, value: items.splice(0, 30).join("\n")})
            items = items.splice(0, 30)
            index++
        }
    } else {
        embed.addFields({name: "Ingredients", value: items.join("\n")})
    }
    return embed;
}