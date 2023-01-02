const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
module.exports = {
    command: {
        name: "shop",
        description: "Fortnite'ın içerik mağazasını gönderir.",
        category: "Fortnite",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription("Fortnite'ın içerik mağazasını gönderir."),

    async run(interaction) {
        const shop = client.db.get(`fortnite_itemshop`)
        if (!shop) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("Hata").setColor("Red").setDescription("İçerik mağazası yüklenemedi.")] })
        const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setURL(shop)
                .setStyle("Link")
                .setLabel("Tarayıcıda Aç"))
        interaction.reply({ embeds: [new EmbedBuilder().setTitle("İçerik Mağazası").setColor("#00CCFF").setImage(shop)], components: [row] })
    },
};