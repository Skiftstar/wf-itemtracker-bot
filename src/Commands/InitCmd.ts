import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ModalBuilder, SlashCommandBuilder } from "discord.js";
import { createChannels, sendReply } from "../DiscordBot/Bot";
import { getConfigValue } from "../Config/Config";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription("Creates all then necessary channels for the bot")
        .addStringOption(option =>
			option.setName("category-name")
				.setDescription("name of the category all channels will be in")
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
        let categoryName = interaction.options.getString("category-name", true).toLowerCase()

        const create = () => {
            createChannels(interaction.guildId!, categoryName)
        }

        const guildId: string = getConfigValue("guildId")

        //If there's an entry for the guild already
        if (guildId.length > 0) {
            const row: any = new ActionRowBuilder()
                .setComponents(
                new ButtonBuilder()
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('cancel'),
                new ButtonBuilder()
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('confirm'));

            //Create a message with 2 buttons and ask if the user wants to override the channels
            const response = await interaction.reply({
                content : "There already seem to be channels set up... Do you still want to continue?",
                components : [row],
                fetchReply : true
            })

            const collectorFilter = (i: any) => i.user.id === interaction.user.id;
            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                //If Yes, then override
                if (confirmation.customId === 'confirm') {
                    create()
                    await confirmation.update({ content: 'Channels created!' })
                //If no, then just cancel
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: 'Action cancelled', components: [] });
                }
            } catch (e) {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        }
        // If there's no previous channels set up, just create the channels immediately
        else {
            create()
            sendReply(interaction, "Channels created!")
        }

	},
};