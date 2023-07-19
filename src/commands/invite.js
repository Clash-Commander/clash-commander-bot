module.exports = {
    name: "invite",
    description: "Lets you invite the bot",


    async execute(interaction) {

            interaction.editReply({
               content: "# Invite *Clash Commander* to you discord server \n> https://discord.com/application-directory/1057995097167368222",
            }).catch((err) => { console.log(err) });

    },
};