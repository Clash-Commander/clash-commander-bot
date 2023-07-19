const { Embed, Button, ButtonStyles, ActionRow } = require("interactions.js");
const axios = require("axios");
const canvas = require("@napi-rs/canvas");

module.exports = {
  name: "clan",
  description: "Display info about a clan",
  options: [
    {
      name: "tag",
      description: "The tag for the clan you want to display",
      type: 3,
      required: true,
    },
  ],

  async execute(interaction) {
    async function color(imagePath) {
      try {
        const canvasObject = canvas.createCanvas(640, 640);
        const ctx = canvasObject.getContext("2d");
        const image = await canvas.loadImage(imagePath);
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(260, 260, 1, 1);
        const [r, g, b] = imageData.data;
        const color = `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

        return color;
      } catch (error) {
        console.error(error);
        return "#c9cad4";
      }
    }
    const clashEmbed = new Embed();
    const tag = interaction.options
      .getStringOption("tag")
      .value.replace("#", "");
    try {
      const response = await axios({
        method: "get",
        url: `https://api.clashofclans.com/v1/clans/%23${tag}`,
        headers: {
          Authorization: "Bearer " + process.env.COCKEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = response.data;
      const colorEmbed = await color(data.badgeUrls.large);
      clashEmbed
        .setTitle(data.name)
        .setColor(colorEmbed)
        .setThumbnail(data.badgeUrls.large)
        .setDescription(`> ${data.description}`)
        .addFields([
          {
            name: "Clan Level",
            value: `<:XP:1058060420205785118> ${data.clanLevel}`,
            inline: true,
          },
          {
            name: "Clan Points",
            value: `<:trophy:1058058304972128297> ${data.clanPoints}`,
            inline: true,
          },
          {
            name: "Clan Versus Points",
            value: `<:versustrophy:1058110680881967158> ${data.clanVersusPoints}`,
            inline: true,
          },
          {
            name: "Clan Capital Points",
            value: `<:trophyC:1058057404778037288> ${data.clanCapitalPoints}`,
            inline: true,
          },
          {
            name: "Required Trophies",
            value: `<:trophy:1058058304972128297> ${data.requiredTrophies} \n`,
            inline: true,
          },
          {
            name: "War Win Streak",
            value: `<:war:1058061175985803334> ${data.warWinStreak || 0}`,
            inline: true,
          },
          {
            name: "Clan War Win",
            value: `<:win:1058062962285346837> ${data.warWins || 0}`,
            inline: true,
          },
          {
            name: "Clan Wars Tie",
            value: `<:tie:1058062965049413763> ${data.warTies || 0}`,
            inline: true,
          },
          {
            name: "Clan Wars Lost",
            value: `<:lost:1058062963690442762> ${data.warLosses || 0}`,
            inline: true,
          },
        ]);
      const button = new ActionRow().addComponent(
        new Button()
          .setStyle(ButtonStyles.Link)
          .setLabel("Visit Clan")
          .setEmoji({ name: "clash_of_clans", id: "1057418626195525633" })
          .setURL(
            `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${tag}`,
          ),
      );
      return interaction.editReply({
        embeds: [clashEmbed],
        components: [button],
      });
    } catch (error) {
      console.error(error);
      const errorEmbed = new Embed()
        .setTitle("Error")
        .setColor("#FF0000")
        .setDescription(
          `The clan tag #${tag} provided was invalid! You can use [Clash of Stats](https://www.clashofstats.com/) to find your clan tag or check in game.`,
        );
      return interaction.editReply({
        embeds: [errorEmbed],
      });
    }
  },
};
