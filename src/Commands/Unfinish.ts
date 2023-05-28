import { Message } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, removeItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	name: 'undone',
	execute(args: string[], message: Message) {
        if (args.length === 0) {
			return sendReply(message, "Provide an Item Name!")
		}

		let itemName = args.join(' ').toLowerCase()
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(message, "Item doesn't exist!")
		}

		removeItem(itemName, item.category, StatusType.finished)
        reloadEmbeds()
        return sendReply(message, `Successfully readded: ${item.name}`)
	},
};