const { Embed } = require("interactions.js");
const axios = require("axios");
require("dotenv").config()

module.exports = {
        name: "goldpass",
        description: "Display info about the gold pass",


    async execute(interaction) {

        function convertToIso(dateString) {
            // Split the date string into separate parts
            const parts = dateString.split("T");

            // Get the date and time parts
            const datePart = parts[0];
            const timePart = parts[1];

            // Insert hyphens into the date part
            const isoDate = `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6)}`;

            // Insert colons into the time part
            const isoTime = `${timePart.slice(0, 2)}:${timePart.slice(2, 4)}:${timePart.slice(4, 6)}${timePart.slice(6)}`;

            // Concatenate the date and time parts to get the ISO 8601 string
            const isoString = `${isoDate}T${isoTime}`;

            return isoString;
        }


        let clashembed = new Embed()
        let cocdata = "";
        await axios({
            method: "get",
            url: `https://api.clashofclans.com/v1/goldpass/seasons/current`,
            headers: {
                Authorization: "Bearer " + process.env.COCKEY,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then(async (res) => {
                if (res.status == 200) {
                    cocdata = res.data;

                    const isoString = convertToIso(cocdata.startTime);
                    const isoString2 = convertToIso(cocdata.endTime);

                    const unix1 = Date.parse(isoString);
                    const unix2 = Date.parse(isoString2);

                    clashembed
                        .setTitle("Goldpass")
                        .setColor("#ffc147")
                        .setThumbnail("https://imgs.search.brave.com/P_VWVYXFAR0gXiGzoyAru6j-z7W51w9pd1D5hHErxok/rs:fit:400:400:1/g:ce/aHR0cHM6Ly9pMS53/cC5jb20vZ2FtaW5n/Z2VhcnNuZXBhbC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MTkvMTIvZ29sZC1w/YXNzLnBuZz9maXQ9/NDAwJTJDNDAwJnNz/bD0x")
                        .setDescription(`> The gold pass includes:  \n \n **Hero Skins** - 1 skin per month \n \n **1 Gem Donations** - Quick donate troops at the cost of 1 Gem per troop.\n \n **Builder Boost** - Buildings and Heroes require fewer resources and less time to build and upgrade.\n \n **Research Boost** - Troop, Spell, and Siege Machine upgrades in the Laboratory cost fewer resources and take less time to finish.\n \n **Training Boost** - Training troops, spells, and Siege Machines take less time to train. Heroes take less time to heal.\n \n **Upgrade levels** to Season Bank - With Gold Pass Season Bank can be upgraded to hold 25 Million Gold, 25 Million Elixir, and 250k Dark Elixir.\n \n Unlock next reward tiers with Gems`)
                        .addFields([
                            { name: "Season Start", value: `<t:${unix1 / 1000 | 0}:R>`, inline: true },
                            { name: "Season End", value: `<t:${unix2 / 1000 | 0}:R>`, inline: true },
                        ]),
                        interaction.editReply({
                            embeds: [clashembed],
                        }).catch((err) => { console.log(err) });

                } else {
                    console.log(res.status);

                }
            })
            .catch((err) => {
                clashembed
                    .setTitle("Error")
                    .setColor("#FF0000")
                    .setDescription(`${err}`)

                return interaction.editReply({
                    embeds: [clashembed],
                }).catch((err) => { console.log(err) });
            });
    },
};