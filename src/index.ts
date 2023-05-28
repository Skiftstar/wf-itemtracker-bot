import { readdirSync } from "fs";
import { loadInitialData } from "./DataBuilder/DataBuilder";
import { sendError, startBot } from "./DiscordBot/Bot";
import path from "path";
import { runCommand } from "./SystemCommandRunner/SystemCommandRunner";
import { Client, Collection, Intents, Message } from "discord.js";
import { getConfigValue } from "./Config/Config";

export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commandFolder = path.join(__dirname, "Commands")
const commandFiles = readdirSync(commandFolder);
const commands = new Collection();


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.set(command.name, command);
}

for (const file of commandFiles) {
    console.log(file)
    console.log(commandFolder)
    const command = runCommand('node', [path.join(commandFolder, file)])
}

startBot()



client.on('ready', () => {
    console.log("Bot started!")
})

client.on('message', (message) => {
    const cmdPrefix = getConfigValue("prefix")
    if (!message.content.startsWith(cmdPrefix)) return

    const args = message.content.split(" ")
    const command = args[0].split(cmdPrefix)[1]
    args.shift()

    // execCommand(command, args, message)
})

client.on('error', (error) => {
    sendError(error.name, error.message)
})
