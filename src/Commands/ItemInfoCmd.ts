import { Message, MessageEmbed, TextChannel } from "discord.js";
import { sendEmbed, sendReply } from "../DiscordBot/Bot";
import { nameToItemMap } from "..";
import { DropItem, ResponseItem } from "../Types/Types";
import { getConfigValue } from "../Config/Config";

module.exports = {
	name: 'itemInfo',
	execute(args: string[], message: Message) {
        if (args.length === 0) {
			return sendReply(message, "Provide an Item Name!")
		}

		let itemName = args.join(' ').toLowerCase()
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(message, "Item doesn't exist!")
		}

		return sendEmbed(message.channel as TextChannel, generateInfoEmbed(item))
	},
};

const generateInfoEmbed = (item: ResponseItem) => {
	const maxCharacterCountInEmbedField = getConfigValue("maxCharacterCountInEmbedField")

	const embed = new MessageEmbed()
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

			embed.addField(component.name + ++linesCount, infoCopy)
		}
		if (component.name === "Blueprint" && info.length === 0 && item.bpCost) {
			console.log("Here", component)
			embed.addField("Blueprint: " + component.itemCount, "Market: " + item.bpCost)
		} else {
			embed.addField(component.name + ": " + component.itemCount, info.length > 0 ? info : "No drops")
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