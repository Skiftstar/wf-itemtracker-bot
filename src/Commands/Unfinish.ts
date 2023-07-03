import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, removeItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('undone')
		.setDescription("Removes an item from 'done'")
		.addStringOption(option =>
			option.setName("item")
				.setDescription("the item you want to remove from 'done'")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		let itemName = interaction.options.getString("item", true).toLowerCase()
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(interaction, "Item doesn't exist!")
		}

		removeItem(itemName, item.category, StatusType.finished)
        reloadEmbeds()
        return sendReply(interaction, `Successfully readded: ${item.name}`)
	},
};