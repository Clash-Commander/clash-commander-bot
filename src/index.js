const { Application } = require("interactions.js");
require("./util/voteLogger")
require('dotenv').config()

/* Misc */
console.clear();

/* Initialize client */
const client = new Application({
  botToken: process.env.TOKEN,
  publicKey: process.env.PUBLICKEY,
  applicationId: process.env.APPLICATIONID,
  port: 8221,
});

client.on("debug", debug => console.log(debug));

const clashComponents = async () => {
  require('./util/clashClient')(client);
  }


clashComponents();