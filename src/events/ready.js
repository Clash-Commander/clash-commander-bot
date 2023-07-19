const { readdirSync } = require('fs');
const { ChalkAdvanced } = require('chalk-advanced');
require("dotenv").config()
const axios = require("axios")

module.exports = async (client) => {
  const commandFiles = readdirSync('./src/commands/')
    .filter((file) => file.endsWith('.js'));

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command);
    client.commands.set(command.name, command);
  }

  if (process.env.STATUS === 'PRODUCTION') {
    client.setAppCommands(commands)
      .catch(console.log);

      // eslint-disable-next-line no-inner-declarations
      async function postStats() {
      try {
          let servercount = null;
          await axios({
              method: 'GET',
              url: `https://japi.rest/discord/v1/application/1057995097167368222`,
              headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
              },
          })
              .then((res) => {
                servercount = res.data.data.bot.approximate_guild_count;
              })
     
        await axios({
          method: "post",
          url: `https://top.gg/api/bots/1057995097167368222/stats`,
          headers: {
              Authorization: process.env.TOPGG,
              "Content-Type": "application/json",
              Accept: "application/json",
              },
              data: {
                "server_count": servercount,
                "shard_count": 1
              }
      })
      } catch(err)  {
        console.log(err)
      }
    }
      postStats()

      setInterval(postStats, 3600000)
  } else {
    client.setGuildCommands(commands, process.env.GUILD_ID)
      .catch(console.log);

    console.log(
      `${ChalkAdvanced.white('Clash Commander')} ${ChalkAdvanced.gray(
        '>',
      )} ${ChalkAdvanced.green('Successfully registered commands locally')}`,
    );
  }
};
