import { ChatInputCommandInteraction } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, addItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";
import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crafted')
		.setDescription("Set an item as 'crafted'")
		.addStringOption(option =>
			option.setName("item")
				.setDescription("the item you want to set as crafted")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		let itemName = interaction.options.getString("item", true)
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(interaction, "Item doesn't exist!")
		}

		if (addItem(itemName, item.category, StatusType.crafted)) {
			reloadEmbeds()
			return sendReply(interaction, `Successfully crafted: ${item.name}`)
		}

		return sendReply(interaction, "Item already crafted/completed!")
	},
};