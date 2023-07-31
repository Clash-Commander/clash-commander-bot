module.exports = {
  name: "support",
  description: "Sends an invite to the support server",

  async execute(interaction) {
    interaction
      .editReply({
        content:
          "# Make sure to join our support server! \n> https://discord.gg/epHmvJHVvt",
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
