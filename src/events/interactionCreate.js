module.exports = async (client, interaction) => {
	interaction.deferReply();
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	if (client.config.basicInformation.currentMode.toLowerCase() === "development" && !client.config.basicInformation.botDevelopers.includes(interaction.user.id)) return await interaction.editReply({
		content: "The bot is currently in \`Development\` mode, only developers can currently interact with the bot.",
		ephemeral: true
	}).catch(() => { });

	try {
		return command.execute(interaction, client);
	} catch (err) {
		if (err) console.error(err);
		return await interaction.editReply({
			content: "An error occurred while executing that command.",
			ephemeral: true
		}).catch(() => { });
	}
};