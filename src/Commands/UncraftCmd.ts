import { Message } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, removeItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	name: 'uncraft',
	execute(args: string[], message: Message) {
        if (args.length === 0) {
			return sendReply(message, "Provide an Item Name!")
		}

		let itemName = args.join(' ').toLowerCase()
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(message, "Item doesn't exist!")
		}

		removeItem(itemName, item.category, StatusType.crafted)
        reloadEmbeds()
        return sendReply(message, `Successfully uncrafted: ${item.name}`)
	},
};