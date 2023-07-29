const { Embed, Button, ButtonStyles, ActionRow } = require("interactions.js");
//TODO: Make this done by using the client.commands not hardcoded.

module.exports = {
	name: "help",
	description: "The help command.",

	async execute(interaction, client) {
		const buttonEmoji = (client.config.emojis.coc).match(/<:(\w+):(\d+)>/);
		const button = new ActionRow().addComponent(
			new Button()
				.setStyle(ButtonStyles.Link)
				.setLabel("Support Server")
				.setEmoji({ name: buttonEmoji[1], id: buttonEmoji[2] })
				.setURL(client.config.links.supportServer),
		);

		let clashEmbed = new Embed()
			.setTitle("**__Clash Commander__**")
			.setColor(client.config.colours.main)
			.setDescription(`**Bot Created By:** ${client.config.basicInformation.botDevelopers.reduce((acc, id, index, arr) => acc + `<@${id}>${index < arr.length - 1 ? (index === arr.length - 2 ? ' and ' : ', ') : ''}`, '')}.\n> A bot that displays information about Clash of Clans.\n\n ** __Commands: __ ** `)
			.setThumbnail(client.avatarURL)
			.setFooter(client.config.basicInformation.footerName, client.avatarURL)
			.addFields([
				{
					name: "</clan:1058162162465517649>",
					value: `Display info about a clan.`,
					inline: false
				},
				{
					name: "</goldpass:1058162162465517650>",
					value: `Display info about the gold pass.`,
					inline: false
				},
				{
					name: "</help:1058163598452609054>",
					value: `The help command.`,
					inline: false
				},
				{
					name: "</invite:1129058549796974663>",
					value: `Lets you invite the bot.`,
					inline: false
				},
				{
					name: "</player:1058162162465517651>",
					value: `Display info about a player.`,
					inline: false
				},
				{
					name: "</support:1129058549796974664>",
					value: `Invites you to the support server.`,
					inline: false
				}
			])

		await interaction
			.editReply({
				embeds: [clashEmbed],
				components: [button],
			}).catch(() => { });
	},
};
