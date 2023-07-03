import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { StatusType, addItem } from "../ItemHandler/ItemHandler";
import { nameToItemMap, reloadEmbeds } from "..";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('done')
		.setDescription("Set an item as 'done'")
		.addStringOption(option =>
			option.setName("item")
				.setDescription("the item you want to set as done")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		let itemName = interaction.options.getString("item", true)
		
		const item = nameToItemMap.get(itemName)

		if (!item) {
			return sendReply(interaction, "Item doesn't exist!")
		}

		if (addItem(itemName, item.category, StatusType.finished)) {
			reloadEmbeds()
			return sendReply(interaction, `Successfully finished: ${item.name}`)
		}

		return sendReply(interaction, "Item already completed!")
	},
};