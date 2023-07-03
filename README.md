# wf-bot

Hej! This bot is designed to track your item progress in Warframe, while providing some useful utilities like drop infos and a list of remaining required metarials.
The bot is designed to for one person on a seperate Server. There isn't support for multiple people on a single Server yet!

It collects all the data from the API provided by [warframe-status](https://github.com/wfcd/warframe-status)

## Disclaimer

If items are missing when they are freshly released, the Warframe-Status API might not have included them yet, so my application might not display them!

## Requirements

- [Node.JS 18 LTS or later](https://nodejs.org/en)

## Getting Started

1. Fork this Repo/Download the code (forking will allow automatic github backups)
2. If you have forked, clone your repo locally (if you downloaded, skip this)
3. [Create an application on Discord](https://discord.com/developers/applications)
4. Copy the application ID and set it in config/clientConfig.json
5. Click on `Bot`
6. Reset the Token, copy the new one and set it in config/clientConfig.json
7. Click on `OAuth2` then on `URL Generator`
8. Select `bot` and `applications.command`
9. Give the bot permissions, I recommend `Send Messages`, `Manage Channels`, `Manage Messages`, `Embed Links`
10. Copy the link, paste it into your Browser and add the bot to your server
11. run `npm i` in the root directory of the bot
12. run the bot with `node start.js`
13. Execute the `/init` command on the discord Server, which will lead to the bot creating a category and channels for the item-tracking
14. You're good to go!

## Features

Items can be labeled as 'crafted' with `/crafted` and removed with `/uncraft`. Labeling them as crafted removes them from ressource calculations and flags them in the embeds.

Items can be set as 'done' with `/done` and added back with `/undone`. Setting them as done removes them from ressource calculations and from the embeds.

Information about a single item can be seen with the `/iteminfo` command.

`/ingredients` returns a list of missing ingredients (might not be totally accurate, if items with complex (multiple sub crafts) crafting recipes are included).

The `/refresh` command refetches all data and then reloads all the embeds.

And with `/wiki` you can quickly let the bot look for a specific wiki entry (keep in mind that the wiki title must be exactly the query inputted).

## Configurations

You can enable automatic backup to your git repo (if you've created a fork, that is) in /config/config.json. Make sure never to push your bot token!

There are also additional config values in this file, if you want to customize anything else!
