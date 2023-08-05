const { Embed, Button, ButtonStyles, ActionRow } = require("interactions.js");
const axios = require("axios");
const canvas = require("@napi-rs/canvas");

module.exports = {
	name: "clan",
	description: "Display info about a clan.",
	options: [
		{
			name: "tag",
			description: "The tag for the clan you want to display.",
			type: 3,
			required: true,
		},
	],

	async execute(interaction, client) {
		async function color(imagePath) {
			const canvasObject = canvas.createCanvas(640, 640);
			const ctx = canvasObject.getContext("2d");
			const image = await canvas.loadImage(imagePath);
			ctx.drawImage(image, 0, 0);

			const { data } = ctx.getImageData(260, 260, 1, 1);
			const [r, g, b] = data;
			const color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
			return color;
		}

		const string = interaction.options.getStringOption("tag").value.startsWith("#") ? interaction.options.getStringOption("tag").value.slice(1) : interaction.options.getStringOption("tag").value;

		let cocData = "";
		await axios({
			method: "GET",
			url: `${client.config.links.cocAPI}/clans/%23${string}`,
			headers: {
				Authorization: "Bearer " + process.env.COC_KEY,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}).then(async (res) => {
			if (res.status == 200) {
				cocData = res.data;

				const colourEmbed = await color(cocData.badgeUrls.large);

				let clashEmbed = new Embed()
					.setTitle(cocData.name)
					.setColor(colourEmbed)
					.setThumbnail(cocData.badgeUrls.large)
					.setDescription(`> ${cocData.description}`)
					.setFooter(client.config.basicInformation.footerName, client.user.avatarURL)
					.addFields([
						{
							name: "Clan Level",
							value: `${client.config.emojis.xp} ${cocData.clanLevel}`,
							inline: true
						},
						{
							name: "Clan Points",
							value: `${client.config.emojis.trophy} ${cocData.clanPoints}`,
							inline: true
						},
						{
							name: "Clan Versus Points",
							value: `${client.config.emojis.versusTrophy} ${cocData.clanVersusPoints}`,
							inline: true
						},
						{
							name: "Clan Capital Points",
							value: `${client.config.emojis.trophyC} ${cocData.clanCapitalPoints}`,
							inline: true
						},
						{
							name: "Required Trophies",
							value: `${client.config.emojis.trophy} ${cocData.requiredTrophies} \n`,
							inline: true
						},
						{
							name: "War Win Streak",
							value: `${client.config.emojis.war} ${cocData.warWinStreak ?? 0}`,
							inline: true
						},
						{
							name: "Clan War Win",
							value: `${client.config.emojis.win} ${cocData.warWins ?? 0}`,
							inline: true
						},
						{
							name: "Clan Wars Tie",
							value: `${client.config.emojis.tie} ${cocData.warTies ?? 0}`,
							inline: true
						},
						{
							name: "Clan Wars Lost",
							value: `${client.config.emojis.lost} ${cocData.warLosses ?? 0}`,
							inline: true
						},
					]);

				const buttonEmoji = (client.config.emojis.coc).match(/<:(\w+):(\d+)>/);
				const button = new ActionRow().addComponent(
					new Button()
						.setStyle(ButtonStyles.Link)
						.setLabel("Visit Clan")
						.setEmoji({ name: buttonEmoji[1], id: buttonEmoji[2] })
						.setURL(`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${string}`),
				);

				await interaction
					.editReply({
						embeds: [clashEmbed],
						components: [button],
					}).catch(() => { });
			}
		})
			.catch(async () => {
				const errorEmbed = new Embed()
					.setTitle("Error")
					.setColor(client.config.colours.red)
					.setFooter(client.config.basicInformation.footerName, client.user.avatarURL)
					.setDescription(`The clan tag provided was invalid! You can use [Clash of Stats](${client.config.links.cocStats}) to find your clan tag or check in game.`);

				return interaction
					.editReply({
						embeds: [errorEmbed],
					}).catch(() => { });
			});
	},
};