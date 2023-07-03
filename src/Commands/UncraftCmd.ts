import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, removeItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uncraft')
		.setDescription("Removes an item from 'crafted'")
		.addStringOption(option =>
			option.setName("item")
				.setDescription("the item you want to remove from 'crafted'")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		let itemName = interaction.options.getString("item", true)
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(interaction, "Item doesn't exist!")
		}

		removeItem(itemName, item.category, StatusType.crafted)
        reloadEmbeds()
        return sendReply(interaction, `Successfully uncrafted: ${item.name}`)
	},
};