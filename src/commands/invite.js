module.exports = {
	name: "invite",
	description: "Lets you invite the bot.",

	async execute(interaction, client) {
		await interaction.editReply({
			content: `# Invite *Clash Commander* to you discord server!\n> ${client.config.links.botInvite}`,
		}).catch(() => { });
	},
};
