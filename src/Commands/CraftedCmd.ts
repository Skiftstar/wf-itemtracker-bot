import { Message } from "discord.js";

module.exports = {
	name: 'fullscren',
	execute(args: string[], message: Message) {
        message.reply("test")
	},
};