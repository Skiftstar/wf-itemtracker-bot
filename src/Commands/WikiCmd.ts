import { Message } from "discord.js";
import { sendReply } from "../DiscordBot/Bot";
import { testWikiPage } from "../Axios/Axios";
import { firstLetterUpper } from "../Util/Util";

module.exports = {
	name: 'wiki',
	execute(args: string[], message: Message) {
        if (args.length === 0) {
			return sendReply(message, "Provide an Item Name!")
		}
        
        args.forEach((item, index) => {
            args[index] = firstLetterUpper(item)
        })

        const url = `https://warframe.fandom.com/wiki/${args.join("_")}`
		testWikiPage(url).then(valid => {
            if (valid) {
                sendReply(message, url)
            } else {
                sendReply(message, "Item doesn't have wiki page!")
            }
        })
	},
};