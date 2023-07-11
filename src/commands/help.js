const { Embed } = require("interactions.js");
const axios = require("axios");
require("dotenv").config()

module.exports = {
    name: "help",
    description: "The help command",


    async execute(interaction, client) {


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
            ]),
            interaction.editReply({
                embeds: [clashembed],
            }).catch((err) => { console.log(err) });

    },
};