import { Message, MessageEmbed, TextChannel } from "discord.js";
import { getConfigValue } from "../Config/Config";
import { client } from "..";

export const startBot = () => {
    client.login(getConfigValue("token"))
}
export const sendMessage = (channel: TextChannel, message: string) => {
    channel.send(message)
}

export const sendReply = (message: Message, reply: string) => {
    message.reply(reply)
}

export const bulkDelete = (channel: TextChannel) => {
    channel.bulkDelete(20);
}

export const sendError = (error: string, additionalData?: any) => {
    if (client.isReady()) {
        const errChannel = getConfigValue("errorChannel")
        getChannelById(errChannel).send(error)
    } else {
        console.log(error)
    }
    console.log(additionalData)
}

export const sendEmbed = (channel: TextChannel, embed: MessageEmbed) => {
    channel.send({ embeds: [embed] }).catch(err => {
        sendError("Error while sending embed, see logs", err)
    })
}

export const getChannelById = (channelId: string) => {
    const guildId = getConfigValue("guildId")

    return client.guilds.cache.get(guildId)?.channels.cache.get(channelId) as TextChannel
}