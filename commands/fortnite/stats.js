const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, resolveColor, Embed } = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
    command: {
        name: "stats",
        description: "Fortnite'daki bir oyunucunun istatistiklerini gösterir.",
        category: "Fortnite",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("Fortnite'daki bir oyunucunun istatistiklerini gösterir.")
        .addStringOption((option) => option.setName("epic").setDescription("Kullanıcının fortnite adı").setRequired(true)),

    async run(interaction) {
        try {
            const epic = interaction.options.getString("epic")
            const response = await fetch(`https://fortnite-api.com/v2/stats/br/v2/?name=${epic}&image=all&timeWindow=lifetime`, {
                method: 'get',
                headers: {
                    Authorization: client.config.api_keys.fortniteapicom
                }
            });

            const data = await response.json();
            if (data.status === 404) {
                await interaction.reply({ content: "Böyle bir oyuncu bulunamadı." })

            }
            if (data.status === 403) {
                await interaction.reply({ content: "Bu oyuncunun istatistikleri gizli." })
            }
            if (data.status === 200) {
                await interaction.reply({ embeds: [new EmbedBuilder().setImage(data.data.image).setColor("#00FF00")] })

            }
        } catch (error) {
            console.log(error)
        }
    }
}