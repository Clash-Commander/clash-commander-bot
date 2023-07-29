const { Embed, Button, ButtonStyles, ActionRow } = require("interactions.js");
const axios = require("axios");

module.exports = {
	name: "player",
	description: "Display a player profile.",
	options: [
		{
			name: "tag",
			description: "The tag for the player profile you want to display",
			type: 3,
			required: true,
		},
	],

	async execute(interaction, client) {
		let string = interaction.options.getStringOption("tag").value;
		if (string.startsWith("#")) { string = string.slice(1); }

		let cocData = "";

		await axios({
			method: "GET",
			url: `${client.config.links.cocAPI}/players/%23${string}`,
			headers: {
				Authorization: "Bearer " + process.env.COC_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				cocData = res.data;

				let emoji = `${client.config.emojis.unRanked}`;
				switch (cocData?.league?.name) {
					case "Bronze League III" || "Bronze League II" || "Bronze League I":
						emoji = `${client.config.emojis.bronze}`;
						break;
					case "Silver League III" || "Silver League II" || "Silver League I":
						emoji = `${client.config.emojis.silver}`;
						break;
					case "Gold League III" || "Gold League II" || "Gold League I":
						emoji = `${client.config.emojis.gold}`;
						break;
					case "Crystal League III" || "Crystal League II" || "Crystal League I":
						emoji = `${client.config.emojis.crystal}`;
						break;
					case "Master League III" || "Master League II" || "Master League I":
						emoji = `${client.config.emojis.master}`;
						break;
					case "Champions League III" || "Champions League II" || "Champions League I":
						emoji = `${client.config.emojis.champion}`;
						break;
					case "Titan League III" || "Titan League II" || "Titan League I":
						emoji = `${client.config.emojis.titan}`;
						break;
					case "Legend League":
						emoji = `${client.config.emojis.legend}`;
						break;
					default:
						emoji = `${client.config.emojis.unRanked}`;
						break;
				}

				let clashEmbed = new Embed()
					.setTitle(`${emoji} ${cocData.name} ${cocData.tag}`)
					.setURL(`${client.config.links.cocStats}/players/-${string}/summary`)
					.setColor(client.config.colours.main)
					.setFooter(client.config.basicInformation.footerName, client.avatarURL)
					.addFields([
						{
							name: "Townhall Level",
							value: `${client.config.emojis.th10} ${cocData.townHallLevel} | Weapon: ${cocData?.townHallWeaponLevel || "0"}`,
							inline: true,
						},
						{
							name: "Level",
							value: `${client.config.emojis.xp} ${cocData.expLevel}`,
							inline: true,
						},
						{
							name: "Clan",
							value: `${client.config.emojis.lookingForClanMates} [${cocData?.clan?.name || "Not in a clan"
								}](${client.config.links.cocStats}/clans/${cocData?.clan?.tag?.slice(1) || "#"
								}/summary)`,
							inline: true,
						},
						{
							name: "Trophies",
							value: `${client.config.emojis.trophyCoc} ${cocData.trophies}`,
							inline: true,
						},
						{
							name: "Personal Best",
							value: `${client.config.emojis.pb} ${cocData.bestTrophies}`,
							inline: true,
						},
						{
							name: "War Stars",
							value: `${client.config.emojis.star} ${cocData.warStars}`,
							inline: true,
						},
						{
							name: "Donations",
							value: `${client.config.emojis.speedUp} ${cocData.donations} | Received: ${cocData.donationsReceived}`,
							inline: true,
						},
						{
							name: "Multiplayer Wins",
							value: `${client.config.emojis.war} ${cocData.attackWins + cocData.defenseWins
								}`,
							inline: true,
						},
						{
							name: "Versus Wins",
							value: `${client.config.emojis.win} ${cocData.versusBattleWins}`,
							inline: true,
						},
						{
							name: "Clancapital Contribubtions",
							value: `${client.config.emojis.trophyC} ${cocData.clanCapitalContributions}`,
							inline: true,
						},
						{
							name: "Builderhall Level",
							value: `${client.config.emojis.masterBuilder} ${cocData.builderHallLevel}`,
							inline: true,
						},
						{
							name: "Personal Builder Best",
							value: `${client.config.emojis.versusTrophy} ${cocData.bestVersusTrophies}`,
							inline: true,
						},
					]);

				if (cocData.legendStatistics) {
					if (cocData.legendStatistics.bestSeason) {
						clashEmbed.addFields([
							{
								name: "Legend Trophies",
								value: `${client.config.emojis.legendTrophy} ${cocData.legendStatistics.legendTrophies}`,
								inline: true,
							},
							{
								name: "Best Legend Rank",
								value: `${client.config.emojis.globe} ${cocData.legendStatistics.bestSeason.rank}`,
								inline: true,
							},
						]);
					}
					if (cocData.legendStatistics.bestVersusSeason)
						clashEmbed.addFields([
							{
								name: "Best Builder Rank",
								value: `${client.config.emojis.globe} ${cocData.legendStatistics.bestVersusSeason.rank}`,
								inline: true,
							},
						]);
				}

				const buttonEmoji = (client.config.emojis.championKing).match(/<:(\w+):(\d+)>/);
				const button = new ActionRow().addComponent(
					new Button()
						.setStyle(ButtonStyles.Link)
						.setLabel("Visit Player Profile")
						.setEmoji({ name: buttonEmoji[1], id: buttonEmoji[2] })
						.setURL(`${client.config.links.cocStats}/players/${string}/summary`),
				);
				return await interaction
					.editReply({
						embeds: [clashEmbed],
						components: [button],
					}).catch(() => { });
			}
		}).catch(async () => {
			const errorEmbed = new Embed()
				.setTitle("Error")
				.setColor(client.config.colours.red)
				.setFooter(client.config.basicInformation.footerName, client.avatarURL)
				.setDescription(`The player tag provided was invalid! You can use [Clash of Stats](${client.config.links.cocStats}) to find your player tag or check in game.`);

			return await interaction
				.editReply({
					embeds: [errorEmbed],
				}).catch(() => { });
		});
	},
};
