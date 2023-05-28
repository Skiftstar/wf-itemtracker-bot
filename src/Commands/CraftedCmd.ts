import { Message } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, addItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	name: 'crafted',
	execute(args: string[], message: Message) {
        if (args.length === 0) {
			return sendReply(message, "Provide an Item Name!")
		}

		let itemName = args.join(' ').toLowerCase()
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(message, "Item doesn't exist!")
		}

		if (addItem(itemName, item.category, StatusType.crafted)) {
			reloadEmbeds()
			return sendReply(message, `Successfully crafted: ${item.name}`)
		}

		return sendReply(message, "Item already crafted/completed!")
	},
};