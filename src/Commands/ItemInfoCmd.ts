import { Message } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { nameToItemMap } from "..";

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

		return sendReply(message, "Not yet implemented")
	},
};