const { readdirSync } = require("fs");
const { ChalkAdvanced } = require("chalk-advanced");
const axios = require("axios");

module.exports = async (client) => {
	const commandFiles = readdirSync("../src/commands/").filter((file) => file.endsWith(".js"));
	const commands = [];

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.push(command);
		client.commands.set(command.name, command);
	}

	if (client.config.basicInformation.currentMode.toLowerCase() === "production") {
		client.setAppCommands(commands).catch((err) => { console.log(err) });
		console.log(`${ChalkAdvanced.white("Clash Commander")} ${ChalkAdvanced.gray(">",)} ${ChalkAdvanced.green("Successfully registered commands globally.")}`);

		async function postStats() {
			let serverCount = null;
			await axios({
				method: "GET",
				url: `${client.config.links.japiRestAPI}/application/${process.env.MAIN_APPLICATION_ID}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}).then((res) => { serverCount = res.data.data.bot.approximate_guild_count; }).catch((err) => { console.log(err) });

			await axios({
				method: "POST",
				url: `${client.config.links.topGGApi}/bots/${process.env.MAIN_APPLICATION_ID}/stats`,
				headers: {
					Authorization: process.env.TOP_GG,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				data: {
					server_count: serverCount,
					shard_count: 1,
				},
			}).catch((err) => { console.log(err) });
		}

		postStats();
		setInterval(postStats, 3600000);
	} else {
		client.setGuildCommands(commands, client.config.basicInformation.mainGuildID).catch((err) => { console.log(err) });
		console.log(`${ChalkAdvanced.white("Clash Commander")} ${ChalkAdvanced.gray(">",)} ${ChalkAdvanced.green("Successfully registered commands locally.")}`);
	}
};