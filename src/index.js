const { Application } = require("interactions.js");
const axios = require("axios");
const config = require("./config");
require("dotenv").config();

//* Misc
console.clear();
console.log("─────────────────────────────────────────────────────────────────────────────────────────");

//* Initialize client
const client = new Application({
	botToken: process.env.BOT_TOKEN,
	publicKey: process.env.BOT_PUBLIC_KEY,
	applicationId: process.env.APPLICATION_ID,
	port: config.apiPorts.applicationPort,
});

const fetchUserAvatar = () => { return axios.get(`${config.links.japiRestAPI}/user/${process.env.APPLICATION_ID}`).then((res) => res.data.data.avatarURL).catch(() => { }); };
fetchUserAvatar().then((avatarURL) => { if (avatarURL) { client.avatarURL = avatarURL; } });

client.config = config;
client.on("debug", (debug) => console.log(debug));

if (client.config.basicInformation.currentMode.toLowerCase() === "production") require("./util/voteLogger")(client);
require("./util/clashClient")(client);