const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    command: {
        name: "yaz",
        description: "İstediğiniz şeyi bota yazdırır.",
        category: "Genel",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('yaz')
        .setDescription("İstediğiniz şeyi bota yazdırır.")
        .addStringOption((option) => option.setName("yazı").setDescription("Yazdırmak istediğiniz yazı").setRequired(true)),
    async run(interaction) {
        interaction.deferReply()
        await interaction.deleteReply()
        interaction.channel.send({ content: `${interaction.options.getString("yazı")}`, allowedMentions: { parse: ["users"] } })
    }
}