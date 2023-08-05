const { Embed } = require("interactions.js");
const axios = require("axios");

module.exports = {
	name: "goldpass",
	description: "Display info about the gold pass.",

	async execute(interaction, client) {
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

		let cocData = "";
		await axios({
			method: "GET",
			url: `${client.config.links.cocAPI}/goldpass/seasons/current`,
			headers: {
				Authorization: "Bearer " + process.env.COC_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}).then(async (res) => {
			if (res.status == 200) {
				cocData = res.data;

				const isoString = convertToIso(cocData.startTime);
				const isoString2 = convertToIso(cocData.endTime);

				const unix1 = Date.parse(isoString);
				const unix2 = Date.parse(isoString2);

				let clashEmbed = new Embed()
					.setTitle("**__Gold Pass:__**")
					.setColor(client.config.colours.gold)
					.setFooter(client.config.basicInformation.footerName, client.user.avatarURL)
					.setThumbnail(client.config.links.goldPassImage)
					.setDescription(`> The gold pass includes:\n\n**Hero Skins** - 1 skin per month \n \n **1 Gem Donations** - Quick donate troops at the cost of 1 Gem per troop.\n \n **Builder Boost** - Buildings and Heroes require fewer resources and less time to build and upgrade.\n \n **Research Boost** - Troop, Spell, and Siege Machine upgrades in the Laboratory cost fewer resources and take less time to finish.\n \n **Training Boost** - Training troops, spells, and Siege Machines take less time to train. Heroes take less time to heal.\n \n **Upgrade levels** to Season Bank - With Gold Pass Season Bank can be upgraded to hold 25 Million Gold, 25 Million Elixir, and 250k Dark Elixir.\n \n Unlock next reward tiers with Gems`)
					.addFields([
						{
							name: "Season Start",
							value: `<t:${(unix1 / 1000) | 0}:R>`,
							inline: true,
						},
						{
							name: "Season End",
							value: `<t:${(unix2 / 1000) | 0}:R>`,
							inline: true,
						},
					])

				await interaction
					.editReply({
						embeds: [clashEmbed],
					}).catch(() => { });
			}
		}).catch(async (err) => {
			let errorEmbed = new Embed()
				.setTitle("Error")
				.setColor(client.config.colours.red)
				.setFooter(client.config.basicInformation.footerName, client.user.avatarURL)
				.setDescription(`${err}`);

			return await interaction.editReply({ embeds: [errorEmbed] }).catch(() => { });
		});
	},
};
