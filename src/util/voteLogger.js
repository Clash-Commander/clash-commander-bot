const TopGG = require("@top-gg/sdk");
const express = require("express");
const axios = require("axios");

module.exports = async (client) => {
	const app = express();
	const webhook = new TopGG.Webhook(process.env.WEBHOOK_TOKEN);

	async function startAPI() {
		app.post("/dblwebhook", webhook.listener(async (vote) => {
			console.log(vote);

			let userData = null;
			await axios({
				method: "GET",
				url: `${client.config.links.japiRestAPI}/user/${vote.user}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}).then((res) => {
				userData = res.data.data;
			}).catch((err) => {
				console.log(err);
			});

			await axios({
				method: "POST",
				url: `${process.env.WEBHOOK_VOTE}`,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				data: {
					embeds: [
						{
							title: `${userData.username} voted for us`,
							description: `Thanks <@${vote.user}> for [voting for Clash Commander on Top.gg](${client.config.links.voteLink})\n\n[Vote Now!](${client.config.links.voteLink})\n\nVoting only takes 30 seconds and helps us keep making updates to Clash Commander!`,
							color: client.config.colours.main
						},
					],
					avatar_url: userData.avatarURL || null,
					username: `${userData.username}`,
				},
			}).then((data) => {
				return data;
			});
		}));

		app.listen(client.config.apiPorts.topGGPort);
		console.log(`[DEBUG] TopGG API Online -> Port: ${client.config.apiPorts.topGGPort}`)
	}

	startAPI();
}