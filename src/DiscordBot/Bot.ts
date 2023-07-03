import { Message, EmbedBuilder, TextChannel, Interaction, ChatInputCommandInteraction, ChannelType } from "discord.js";
import { getClientValue, getConfigValue, setConfigValue } from "../Config/Config";
import { client } from "..";
import { ChannelIdRecord } from "../Types/Types";

export const startBot = () => {
    client.login(getClientValue("token"))
}
export const sendMessage = (channel: TextChannel, message: string) => {
    channel.send(message)
}

export const sendReply = (interaction: ChatInputCommandInteraction, reply: string) => {
    interaction.reply(reply)
}

export const replyEmbed = (interaction: ChatInputCommandInteraction, embed: EmbedBuilder) => {
    interaction.reply({embeds: [embed]})
}

export const bulkDelete = (channel: TextChannel) => {
    if (channel === undefined) {
        return sendError(`BulkDelete: Channel is undefined`)
    }
    channel.bulkDelete(20).catch(error => {
        sendError(error)
    });
}

export const sendError = (error: string, additionalData?: any) => {
    if (client.isReady()) {
        const errChannelId = getConfigValue("errorChannel")
        const errChannel = getChannelById(errChannelId)
        if (errChannel === undefined) {
            return console.log("Couldn't find error channel, so printing out instead: ", error)
        }

        errChannel.send(error).catch(err => {
            console.log("Couldn't log in Error channel, so printing out instead: ", error)
        })
    } else {
        console.log(error)
    }
    console.log(additionalData)
}

export const sendEmbed = (channel: TextChannel, embed: EmbedBuilder) => {
    if (channel === undefined) {
        return sendError("sendEmbed: Channel undefined")
    }
    channel.send({ embeds: [embed] }).catch(err => {
        sendError("Error while sending embed, see logs", err)
    })
}

export const getChannelById = (channelId: string) => {
    const guildId = getConfigValue("guildId")

    return client.guilds.cache.get(guildId)?.channels.cache.get(channelId) as TextChannel
}

export const createChannels = (guildId: string, categoryName: string) => {
    const guild = client.guilds.cache.get(guildId)!
    const channels: ChannelIdRecord = {}

    guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory }).then(category => {
        Object.keys(getConfigValue("weaponChannels")).forEach((channelName: string) => {
            guild.channels.create({ name: channelName }).then(channel => {
                channel.setParent(category.id)
                channels[channelName] = channel.id   
            })
        })
        guild.channels.create({ name: "errors" }).then(channel => {
            channel.setParent(category.id)
            setConfigValue("errorChannel", channel.id)
        })

        setConfigValue("weaponChannels", channels)
        setConfigValue("guildId", guildId)
    })

}