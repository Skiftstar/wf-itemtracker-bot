import { readdirSync } from "fs";
import { buildEmbeds, loadInitialData } from "./DataBuilder/DataBuilder";
import { sendError, startBot } from "./DiscordBot/Bot";
import path from "path";
import { Client, Intents } from "discord.js";
import { getConfigValue } from "./Config/Config";
import { ItemArrays, ResponseItem } from "./Types/Types";

export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commandFolder = path.join(__dirname, "Commands")
const commandFiles = readdirSync(commandFolder);
const commands = new Map<string, any>();

let itemArrays: ItemArrays;
let componentsMap = new Map<string, ResponseItem[]>()
export let nameToItemMap = new Map<string, ResponseItem>()

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
	commands.set(command.name, command);
}

startBot()

client.on('ready', () => {
    console.log("Bot started!")
    loadInitialData().then(data => {
        itemArrays = data.arrays
        componentsMap = data.componentsMap
        nameToItemMap = data.nameToItemMap

        console.log("Fetched Data")
        buildEmbeds(itemArrays)
    })
})

client.on('message', (message) => {
    const cmdPrefix = getConfigValue("prefix")
    if (!message.content.startsWith(cmdPrefix)) return

    const args = message.content.split(" ")
    const command = args[0].split(cmdPrefix)[1]
    args.shift()

    commands.get(command)!.execute(args, message);
})

client.on('error', (error) => {
    sendError(error.name, error.message)
})

export const reloadEmbeds = () => {
    buildEmbeds(itemArrays)
}
