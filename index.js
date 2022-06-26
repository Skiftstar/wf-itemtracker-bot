const Discord = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const primaries = [], secondaries = [], melees = [], warframes = [], archwings = [], archguns = [], archmelees = [], companions = []
const options = [{ arr: primaries, name: "primaries" }, { arr: secondaries, name: "secondaries" }, { arr: melees, name: "melees" }, { arr: warframes, name: "warframes" }, { arr: archwings, name: "archwings" }, { arr: archguns, name: "archguns" }, { arr: archmelees, name: "archmelees" }, { arr: companions, name: "companions" }]


const craftedItems = JSON.parse(fs.readFileSync('./crafted.json', 'utf8'))
const completedItems = JSON.parse(fs.readFileSync('./completed.json', 'utf8'))
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

client.login(config.token);

client.on('message', message => {
    const cmd = message.content.split(' ')[0].toLowerCase()
    const args = message.content.split(' ').slice(1)

    if (message.author.id == client.user.id) return

    if (cmd == '<done') {
        if (args.length == 0) {
            return message.reply("Provide an Item Name!");
        }
        let itemName = args.join(' ')
        if (removeWeapon(itemName)) return message.reply("Successfully finished: " + itemName)
        return message.reply("Item already finished or doesn't exist!")
    } 

    if (cmd == "<crafted") {
        if (args.length == 0) {
            return message.reply("Provide an Item Name!");
        }
        let itemName = args.join(' ')
        if (addCraft(itemName)) return message.reply("Successfully crafted: " + itemName)
        return message.reply("Item already crafted or doesn't exist!")
    }

    if (cmd == "<iteminfo") {
        if (args.length == 0) {
            return message.reply("Provide an Item Name!");
        }
        let itemName = args.join(' ')

        for (let j = 0; j < options.length; j++) {
            const option = options[j]
            for (let i = 0; i < option.arr.length; i++) {
                const item = option.arr[i]
                if (item.name.toLowerCase() == itemName.toLowerCase()
                    || (item.name.toLowerCase().includes(config.craftedFlair.toLowerCase()) && item.name.split(config.craftedFlair)[0].toLowerCase() == itemName.toLowerCase())) {
                    let embed = genItemInfoEmbed(item)
                    return message.channel.send({ embeds: [embed] })
                }
            }
        }
        return message.reply("Item doesn't exist or is already leveled!")
    }

    if (cmd == "<info") {
        if (args.length == 0) {
            return message.reply("Provide a category Name!");
        }

        options.forEach(option => {
            if (option.name == args[0].toLowerCase()) {
                genInfoEmbed(option.arr, option.name)
                return;
            }
        })
        function genInfoEmbed(array) {
            let embedArr = [];

            array.forEach(item => {
                embedArr.push(genItemInfoEmbed(item))
            })

            while (embedArr.length > 10) {
                message.channel.send({ embeds: embedArr.slice(0, 10) })
                embedArr = embedArr.slice(10)
            }
        }

    }
    return;
})

function genItemInfoEmbed(item) {
    let embed = new Discord.MessageEmbed()
    embed.setTitle(item.name)
    embed.setColor(0x00AE86)
    embed.setThumbnail(item.wikiaThumbnail)
    if (item.components) {
        item.components.forEach(component => {
            let string = "";
            if (component.drops) {
                const drops = [];
                const relics = [];
                component.drops.forEach(drop => {
                    if (drop.location.includes("Relic") && !relics.includes(drop.location.split(" (")[0])) {
                        const dropCopy = JSON.parse(JSON.stringify(drop));
                        dropCopy.location = dropCopy.location.split(" (")[0]
                        drops.push(dropCopy)
                        relics.push(dropCopy.location)

                        string += dropCopy.location + " ; " + dropCopy.rarity + "\n"
                    } else if (!drop.location.includes("Relic")) {
                        string += drop.location + " ; " + drop.rarity + " ; " + round(drop.chance * 100) + "%\n"
                    }
                })
            }
            let continueString = "";
            let continueNum = 1;
            while (string.length > config.maxEmbedFieldLength) {
                let descCopy = string;
                descCopy = descCopy.slice(0, config.maxEmbedFieldLength);
                const lastSplit = descCopy.lastIndexOf("\n");
                descCopy = descCopy.slice(0, lastSplit);
                string = string.slice(lastSplit + 1);

                continueString = " " + continueNum;
                continueNum++;
                embed.addField(component.name + continueString, descCopy)
                continueString = " " + continueNum;
            }
            if (component.name === "Blueprint" && string.length === 0 && item.bpCost) {
                embed.addField("Blueprint: " + component.itemCount, "Market: " + item.bpCost)
            } else {
                embed.addField(component.name + continueString + ": " + component.itemCount, string.length > 0 ? string : "No drops")
            }
        })
    }
    return embed
}

function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

client.on('ready', () => {
    loadStuff();

})

function removeWeapon(itemName) {
    itemName = itemName.toLowerCase();
    let itemFound = false;
    let op;
    let it;
    for (let j = 0; j < options.length; j++) {
        let option = options[j]
        for (let i = 0; i < option.arr.length; i++) {
            let item = option.arr[i]
            if (item.name.toLowerCase() == itemName) {
                completedItems[option.name].push(item.name)
                removeItemOnce(option.arr, item)
                fs.writeFileSync('./completed.json', JSON.stringify(completedItems))
                reloadEmbeds()
                return true;
            } else if (item.name.toLowerCase().includes(config.craftedFlair.toLowerCase()) && item.name.split(config.craftedFlair)[0].toLowerCase() == itemName.toLowerCase()) {
                itemCopy = JSON.parse(JSON.stringify(item));
                itemCopy.name = itemCopy.name.split(config.craftedFlair)[0];
                completedItems[option.name].push(itemCopy.name)
                removeItemOnce(option.arr, item)
                fs.writeFileSync('./completed.json', JSON.stringify(completedItems))
                reloadEmbeds()
                return true;
                break;
            }
        }
    }
    if (itemFound) {

    }
    return false
}

function addCraft(itemName) {
    itemName = itemName.toLowerCase();
    for (let j = 0; j < options.length; j++) {
        let option = options[j]
        for (let i = 0; i < option.arr.length; i++) {
            let item = option.arr[i]
            if (item.name.toLowerCase() == itemName) {
                craftedItems[option.name].push(item.name)
                item.name = item.name + config.craftedFlair
                option.arr.push(item)
                fs.writeFileSync('./crafted.json', JSON.stringify(craftedItems))
                reloadEmbeds()
                return true
            }
        }
    }
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function reloadEmbeds() {
    let primaryEmbed = generateEmbed(primaries)
    let secondaryEmbed = generateEmbed(secondaries)
    let meleeEmbed = generateEmbed(melees)
    let warframeEmbed = generateEmbed(warframes)
    let archwingEmbed = generateEmbed(archwings)
    let archgunEmbed = generateEmbed(archguns)
    let archmeleeEmbed = generateEmbed(archmelees)
    let companionEmbed = generateEmbed(companions)

    const guild = client.guilds.cache.get(config.guildId);

    sendEmbed(guild.channels.cache.get(config.primariesChannel), primaryEmbed)
    sendEmbed(guild.channels.cache.get(config.secondariesChannel), secondaryEmbed)
    sendEmbed(guild.channels.cache.get(config.meleesChannel), meleeEmbed)
    sendEmbed(guild.channels.cache.get(config.warframesChannel), warframeEmbed)
    sendEmbed(guild.channels.cache.get(config.archwingsChannel), archwingEmbed)
    sendEmbed(guild.channels.cache.get(config.archgunsChannel), archgunEmbed)
    sendEmbed(guild.channels.cache.get(config.archmeleesChannel), archmeleeEmbed)
    sendEmbed(guild.channels.cache.get(config.companionsChannel), companionEmbed)
}

function loadStuff() {
    let primariesTemp = []
    let secondariesTemp = []
    let meleesTemp = []
    let warframesTemp = []
    let archwingsTemp = []
    let archgunsTemp = []
    let archmeleesTemp = []
    let companionsTemp = []

    const obj = [{ arr: primariesTemp, categories: ["Primary"] }, { arr: secondariesTemp, categories: ["Secondary"] }, { arr: meleesTemp, categories: ["Melee"] }, { arr: warframesTemp, categories: ["Warframes"] }, { arr: archwingsTemp, categories: ["Archwing"] }, { arr: archgunsTemp, categories: ["Arch-Gun"] }, { arr: archmeleesTemp, categories: ["Arch-Melee"] }, { arr: companionsTemp, categories: ["Pets", "Sentinels"] }]

    axios
        .get('https://api.warframestat.us/items')
        .then(res => {
            console.log(`statusCode: ${res.status}`);
            const categories = [];
            res.data.forEach(item => {
                if (!categories.includes(item.category)) {
                    categories.push(item.category)
                }

                obj.forEach(object => {
                    if (object.categories.includes(item.category)) {
                        object.arr.push(item)
                        return;
                    }
                })
            })
            filterAndPrint()
            // console.log(categories);

            console.log(client.user.username + ' is online!');
        })
        .catch(error => {
            console.log("Error on startup! Retrying...")
            console.error(error);
            loadStuff();
        });
    function filterAndPrint() {
        primariesTemp.forEach(item => {
            if (completedItems.primaries.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.primaries.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            primaries.push(itemCopy)
        })

        secondariesTemp.forEach(item => {
            if (completedItems.secondaries.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.secondaries.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            secondaries.push(itemCopy)
        })

        meleesTemp.forEach(item => {
            if (completedItems.melees.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.melees.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            melees.push(itemCopy)
        })

        warframesTemp.forEach(item => {
            if (completedItems.warframes.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.melees.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            warframes.push(itemCopy)
        })

        archwingsTemp.forEach(item => {
            if (completedItems.archwings.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.archwings.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            archwings.push(itemCopy)
        })

        archgunsTemp.forEach(item => {
            if (completedItems.archguns.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.archguns.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            archguns.push(itemCopy)
        })

        archmeleesTemp.forEach(item => {
            if (completedItems.archmelees.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.archmelees.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            archmelees.push(itemCopy)
        })

        companionsTemp.forEach(item => {
            if (completedItems.companions.includes(item.name)) {
                return;
            }
            const itemCopy = JSON.parse(JSON.stringify(item))
            if (craftedItems.companions.includes(item.name)) {
                itemCopy.name = itemCopy.name + config.craftedFlair
            }
            companions.push(itemCopy)
        })

        let primaryEmbed = generateEmbed(primaries)
        let secondaryEmbed = generateEmbed(secondaries)
        let meleeEmbed = generateEmbed(melees)
        let warframeEmbed = generateEmbed(warframes)
        let archwingEmbed = generateEmbed(archwings)
        let archgunEmbed = generateEmbed(archguns)
        let archmeleeEmbed = generateEmbed(archmelees)
        let companionEmbed = generateEmbed(companions)

        const guild = client.guilds.cache.get(config.guildId);

        sendEmbed(guild.channels.cache.get(config.primariesChannel), primaryEmbed)
        sendEmbed(guild.channels.cache.get(config.secondariesChannel), secondaryEmbed)
        sendEmbed(guild.channels.cache.get(config.meleesChannel), meleeEmbed)
        sendEmbed(guild.channels.cache.get(config.warframesChannel), warframeEmbed)
        sendEmbed(guild.channels.cache.get(config.archwingsChannel), archwingEmbed)
        sendEmbed(guild.channels.cache.get(config.archgunsChannel), archgunEmbed)
        sendEmbed(guild.channels.cache.get(config.archmeleesChannel), archmeleeEmbed)
        sendEmbed(guild.channels.cache.get(config.companionsChannel), companionEmbed)
    }
}

function sendEmbed(channel, embed) {
    channel.bulkDelete(20);
    channel.send({ embeds: [embed] }).catch(err => {
        console.log(err)
    })
}

function generateEmbed(items) {
    let primes = [], prismas = [], kuvas = [], tenets = [], normals = [], wraiths = [], vandals = []

    items.forEach(itemObj => {
        const item = itemObj.name.split(config.craftedFlair)[0]
        const words = item.split(' ');
        if (words[words.length - 1] === 'Prime') {
            if (!primes.includes(itemObj.name))
                primes.push(itemObj.name)
        }
        else if (words[0] === 'Prisma') {
            if (!prismas.includes(itemObj.name))
                prismas.push(itemObj.name)
        }
        else if (words[0] === 'Kuva') {
            if (!kuvas.includes(itemObj.name))
                kuvas.push(itemObj.name)
        }
        else if (words[0] === 'Tenet') {
            if (!tenets.includes(itemObj.name))
                tenets.push(itemObj.name)
        }
        else if (words[words.length - 1] === 'Wraith') {
            if (!wraiths.includes(itemObj.name))
                wraiths.push(itemObj.name)
        }
        else if (words[words.length - 1] === 'Vandal') {
            if (!vandals.includes(itemObj.name))
                vandals.push(itemObj.name)
        }
        else {
            if (!normals.includes(itemObj.name))
                normals.push(itemObj.name)
        }
    })

    let embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setDescription('These items still need to be leveled up to max.\n\n')

    const object = { primes, prismas, kuvas, tenets, wraiths, vandals, normals }

    for (const key in object) {
        if (object[key].length > 0) {
            let count = 1;
            const keyName = key.charAt(0).toUpperCase() + key.slice(1)
            while (object[key].length > config.splitSubCategoryAt) {
                let fieldName = keyName;
                if (count > 1) fieldName += " " + count;
                embed.addField(fieldName, object[key].slice(0, config.splitSubCategoryAt).join('\n'))
                object[key] = object[key].slice(config.splitSubCategoryAt)
                count++;
            }
            let fieldName = keyName;
            if (count > 1) fieldName += " " + count;
            embed.addField(fieldName, object[key].join('\n'))
        }
    }
    return embed;
}