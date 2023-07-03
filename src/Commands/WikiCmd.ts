import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { testWikiPage } from "../Axios/Axios";
import { firstLetterUpper } from "../Util/Util";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription("Looks for the wiki entry for a specific item")
		.addStringOption(option =>
			option.setName("item")
				.setDescription("the item you want the wiki entry about")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
        const args = interaction.options.getString("item", true).toLowerCase().split(" ")
        args.forEach((item, index) => {
            args[index] = firstLetterUpper(item)
        })

        const url = `https://warframe.fandom.com/wiki/${args.join("_")}`
		testWikiPage(url).then(valid => {
            if (valid) {
                sendReply(interaction, url)
            } else {
                sendReply(interaction, "Item doesn't have wiki page!")
            }
        })
	},
};