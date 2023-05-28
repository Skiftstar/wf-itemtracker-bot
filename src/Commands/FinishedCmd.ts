import { Message } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, addItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	name: 'done',
	execute(args: string[], message: Message) {
        if (args.length === 0) {
			return sendReply(message, "Provide an Item Name!")
		}

		let itemName = args.join(' ').toLowerCase()
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(message, "Item doesn't exist!")
		}

		if (addItem(itemName, item.category, StatusType.finished)) {
			reloadEmbeds()
			return sendReply(message, `Successfully finished: ${item.name}`)
		}

		return sendReply(message, "Item already completed!")
	},
};