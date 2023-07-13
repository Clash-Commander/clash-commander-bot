const { Embed } = require("interactions.js");
const axios = require("axios");
require("dotenv").config()

module.exports = {
    name: "help",
    description: "The help command",


    async execute(interaction, client) {


        const button = new ActionRow()
            .addComponent(
              new Button()
            .setStyle(ButtonStyles.Link)
            .setLabel('Support Server')
            .setEmoji({ name: "clash_of_clans", id: "1057418626195525633", })
            .setURL('https://discord.gg/epHmvJHVvt')
            )

        let clashembed = new Embed()
        clashembed
            .setTitle("Clash Commander")
            .setColor("#2b1729")
            .setDescription("> A bot that displays information about Clash of Clans. \n\n**Commands:**")
            .setThumbnail("https://cdn.discordapp.com/attachments/1047187283234795580/1058163049875374140/clash_commander.png")
            .addFields([
                { name: "</clan:1058162162465517649>", value: `Display info about a clan`, inline: false },
                { name: "</player:1058162162465517651>", value: `Display info about a player`, inline: false },
                { name: "</goldpass:1058162162465517650>", value: `Display info about the gold pass`, inline: false },
                { name: "</help:1058163598452609054>", value: `The help command`, inline: false },
                { name: "</support:1129058549796974664>", value: `Invites you to the support server`, inline: false },
                { name: "</invite:1129058549796974663>", value: `Lets you invite the bot`, inline: false },
            ]),
            interaction.editReply({
                embeds: [clashembed],
                components: [button],
            }).catch((err) => { console.log(err) });

    },
};