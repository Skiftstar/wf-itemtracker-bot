import { Message, EmbedBuilder, TextChannel, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { replyEmbed, sendEmbed, sendReply } from "../DiscordBot/Bot";
import { nameToItemMap } from "..";
import { DropItem, ResponseItem } from "../Types/Types";
import { getConfigValue } from "../Config/Config";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iteminfo')
		.setDescription("Provides information about an item")
		.addStringOption(option =>
			option.setName("item")
				.setDescription("the item you want to get info about")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		let itemName = interaction.options.getString("item", true)
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(interaction, "Item doesn't exist!")
		}

		return replyEmbed(interaction, generateInfoEmbed(item))
	},
};

const generateInfoEmbed = (item: ResponseItem) => {
	const maxCharacterCountInEmbedField = getConfigValue("maxCharacterCountInEmbedField")

	const embed = new EmbedBuilder()
	embed.setTitle(item.name)
	embed.setColor("#00AE86")
	embed.setThumbnail(item.wikiaThumbnail)

	if (!item.components) {
		return embed
	}

	item.components.forEach(component => {
		let info = ""

		if (component.drops) {
			const alreadyAddedRelics: string[] = []
			component.drops.forEach(drop => {
				info += getDropInfo(drop, alreadyAddedRelics)
			})
		}

		let linesCount = 0;
		while (info.length > maxCharacterCountInEmbedField) {
			let infoCopy = info;
			infoCopy = infoCopy.slice(0, maxCharacterCountInEmbedField);

			const lastEntryIndex = infoCopy.lastIndexOf("\n");
			infoCopy = infoCopy.slice(0, lastEntryIndex);
			info = info.slice(lastEntryIndex + 1);

			embed.addFields({name: component.name + ++linesCount, value: infoCopy})
		}
		if (component.name === "Blueprint" && info.length === 0 && item.bpCost) {
			console.log("Here", component)
			embed.addFields({name: "Blueprint: " + component.itemCount, value: "Market: " + item.bpCost})
		} else {
			embed.addFields({name: component.name + ": " + component.itemCount, value: info.length > 0 ? info : "No drops"})
		}
	})

	return embed;
}

const getDropInfo = (drop: DropItem, alreadyAddedRelics: string[]) => {
	let info = ""
	if (drop.location.includes("Relic")) {
		const relicName = drop.location.split("Relic")[0]
		if (alreadyAddedRelics.includes(relicName)) return ""
		alreadyAddedRelics.push(relicName)

		info += drop.location + " ; " + drop.rarity + "\n"
	} else {
		info += drop.location + " ; " + drop.rarity + " ; " + round(drop.chance * 100) + "%\n"
	}
	return info
}

function round(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}