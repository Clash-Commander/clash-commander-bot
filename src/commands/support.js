module.exports = {
	name: "support",
	description: "Sends an invite to the support server.",

	async execute(interaction, client) {
		await interaction.editReply({
			content: `# Make sure to join our support server!\n> ${client.config.links.supportServer}`,
		}).catch(() => { });
	},
};