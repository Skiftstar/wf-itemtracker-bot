import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { setup } from "..";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription("Fetches data again and reloads Embeds"),
	async execute(interaction: ChatInputCommandInteraction) {
        setup()
        sendReply(interaction, "Reloading...")
	},
};