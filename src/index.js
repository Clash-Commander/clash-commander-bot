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

client.fetchClient();

client.config = config;
client.on("debug", (debug) => console.log(debug));

if (client.config.basicInformation.currentMode.toLowerCase() === "production") require("./util/voteLogger")(client);
require("./util/clashClient")(client);