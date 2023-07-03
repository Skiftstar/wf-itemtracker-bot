import { readdirSync } from "fs";
import { buildEmbeds, loadInitialData } from "./DataBuilder/DataBuilder";
import { sendError, sendReply, startBot } from "./DiscordBot/Bot";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { getClientValue, getConfigValue } from "./Config/Config";
import { ItemArrays, ResponseItem } from "./Types/Types";
import { BotClient } from "./DiscordBot/BotClient";
import { REST, Routes } from 'discord.js';

export const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

const commandFolder = path.join(__dirname, "Commands")
const commandFiles = readdirSync(commandFolder);
client.commands = new Collection()
const commands = [];

const token = getClientValue('token')
const clientId = getClientValue('clientId')

export let itemArrays: ItemArrays;
let componentsMap = new Map<string, ResponseItem[]>()
export let nameToItemMap = new Map<string, ResponseItem>()

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

startBot()

client.on('ready', () => {
    console.log("Bot started!")

    const guildId: string = getConfigValue("guildId")
    if (guildId.length === 0) {
        console.log("No channels setup, waiting for init command!")
        return;
    }

    loadInitialData().then(data => {
        itemArrays = data.arrays
        componentsMap = data.componentsMap
        nameToItemMap = data.nameToItemMap

        console.log("Fetched Data")
        buildEmbeds(itemArrays)
    })
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as BotClient).commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
})

client.on('error', (error) => {
    sendError(error.name, error.message)
})

export const reloadEmbeds = () => {
    buildEmbeds(itemArrays)
}
