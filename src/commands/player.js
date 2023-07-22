const { Embed, Button, ButtonStyles, ActionRow } = require("interactions.js");
const axios = require("axios");

module.exports = {
  name: "player",
  description: "Display a player profile",
  options: [
    {
      name: "tag",
      description: "The tag for the player profile you want to display",
      type: 3,
      required: true,
    },
  ],

  async execute(interaction) {
    let clashembed = new Embed();
    let string = interaction.options.getStringOption("tag").value;
    if (string.startsWith("#")) {
      string = string.slice(1);
    }
    console.log(string);
    let cocdata = "";
    await axios({
      method: "get",
      url: `https://api.clashofclans.com/v1/players/%23${string}`,
      headers: {
        Authorization: "Bearer " + process.env.COCKEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        console.log(res.ok);
        if (res.status === 200) {
          cocdata = res.data;
          console.log(cocdata);

          let emoji = "<:unranked:1058111843874390026>";
          console.log(cocdata.bestVersusTrophies);

          switch (cocdata?.league?.name) {
            case "Bronze League III" || "Bronze League II" || "Bronze League I":
              emoji = "<:bronze:1058111836555317379>";
              break;
            case "Silver League III" || "Silver League II" || "Silver League I":
              emoji = "<:silver:1058111846248370206>";
              break;
            case "Gold League III" || "Gold League II" || "Gold League I":
              emoji = "<:gold:1058111841336819773>";
              break;
            case "Crystal League III" || "Crystal League II" || "Crystal League I":
              emoji = "<:crystal:1058111833485094972>";
              break;
            case "Master League III" || "Master League II" || "Master League I":
              emoji = "<:master:1058111848697827429>";
              break;
            case "Champions League III" || "Champions League II" || "Champions League I":
              emoji = "<:champion:1058111852166529105>";
              break;
            case "Titan League III" || "Titan League II" || "Titan League I":
              emoji = "<:titan:1058112109172502528>";
              break;
            case "Legend League":
              emoji = "<:legend:1058111839071899759>";
              break;
            default:
              emoji = "<:unranked:1058111843874390026>";
              break;
          }
          console.log(`https://www.clashofstats.com/players/${string}/summary`);
          clashembed
            .setTitle(`${emoji} ${cocdata.name} ${cocdata.tag}`)
            .setURL(`https://www.clashofstats.com/players/-${string}/summary`)
            .addFields([
              {
                name: "Townhall Level",
                value: `<:th10:1058153940857917540> ${
                  cocdata.townHallLevel
                } | Weapon: ${cocdata?.townHallWeaponLevel || "0"}`,
                inline: true,
              },
              {
                name: "Level",
                value: `<:XP:1058060420205785118> ${cocdata.expLevel}`,
                inline: true,
              },
              {
                name: "Clan",
                value: `<a:looking_for_clanmates:1058110650351636630> [${
                  cocdata?.clan?.name || "Not in a clan"
                }](https://www.clashofstats.com/clans/${
                  cocdata?.clan?.tag?.slice(1) || "#"
                }/summary)`,
                inline: true,
              },
              {
                name: "Trophies",
                value: `<:trophycoc:1058110653740626021> ${cocdata.trophies}`,
                inline: true,
              },
              {
                name: "Personal Best",
                value: `🏋️ ${cocdata.bestTrophies}`,
                inline: true,
              },
              {
                name: "War Stars",
                value: `⭐ ${cocdata.warStars}`,
                inline: true,
              },
              {
                name: "Donations",
                value: `<:speedup:1058110664830357665>  ${cocdata.donations} | Received: ${cocdata.donationsReceived}`,
                inline: true,
              },
              {
                name: "Multiplayer Wins",
                value: `<:war:1058061175985803334> ${
                  cocdata.attackWins + cocdata.defenseWins
                }`,
                inline: true,
              },
              {
                name: "Versus Wins",
                value: `<:win:1058062962285346837> ${cocdata.versusBattleWins}`,
                inline: true,
              },
              {
                name: "Clancapital Contribubtions",
                value: `<:trophyC:1058057404778037288> ${cocdata.clanCapitalContributions}`,
                inline: true,
              },
              {
                name: "Builderhall Level",
                value: `<:masterbuilder:927704205806927882> ${cocdata.builderHallLevel}`,
                inline: true,
              },
              {
                name: "Personal Builder Best",
                value: `<:versustrophy:1058110680881967158> ${cocdata.bestVersusTrophies}`,
                inline: true,
              },
            ]);

          if (cocdata.legendStatistics) {
            if (cocdata.legendStatistics.bestSeason) {
              clashembed.addFields([
                {
                  name: "Legend Trophies",
                  value: `<:legend_trophy:1058110685562814534> ${cocdata.legendStatistics.legendTrophies}`,
                  inline: true,
                },
                {
                  name: "Best Legend Rank",
                  value: `<:globe:1058110688440107099> ${cocdata.legendStatistics.bestSeason.rank}`,
                  inline: true,
                },
              ]);
            }
            if (cocdata.legendStatistics.bestVersusSeason)
              clashembed.addFields([
                {
                  name: "Best Builder Rank",
                  value: `<:globe:1058110688440107099> ${cocdata.legendStatistics.bestVersusSeason.rank}`,
                  inline: true,
                },
              ]);
          }

          const button = new ActionRow().addComponent(
            new Button()
              .setStyle(ButtonStyles.Link)
              .setLabel("Visit Player Profile")
              .setEmoji({ name: "ChampionKing", id: "1058110656987017246" })
              .setURL(`https://www.clashofstats.com/players/${string}/summary`),
          );
          return interaction
            .editReply({
              embeds: [clashembed],
              components: [button],
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(res.status);
        }
      })
      .catch((err) => {
        console.log(err);
        const errorembed = new Embed()
          .setTitle("Error")
          .setColor("#FF0000")
          .setDescription(
            "The player tag provided was invalid! You can use [Clash of Stats](https://www.clashofstats.com/) to find your player tag or check in game.",
          );

        return interaction
          .editReply({
            embeds: [errorembed],
          })
          .catch((err) => {
            console.log(err);
          });
      });
  },
};
