const { Embed } = require("interactions.js");
const axios = require("axios");
require("dotenv").config()

module.exports = {
    name: "support",
    description: "Sends an invite to the support server",


    async execute(interaction, client) {

            interaction.editReply({
               content: "# Make sure to join our support server! \n> https://discord.gg/epHmvJHVvt",
            }).catch((err) => { console.log(err) });

    },
};