const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    command: {
        name: "sunucu",
        description: "Epic Games'in sunucu durumunu görüntülersiniz.",
        category: "Genel",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('sunucu')
        .setDescription("Epic Games'in sunucu durumunu görüntülersiniz."),
    async run(interaction) {
        interaction.reply({ content: "Epic Games sunucu durumunu görüntülemek için aşağıdaki linke tıkla\n<https://status.epicgames.com/>" })
    }
};