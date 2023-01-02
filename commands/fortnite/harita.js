const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
    command: {
        name: "harita",
        description: "Fortnite'daki haritayı gösterir.",
        category: "Fortnite",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('harita')
        .setDescription("Fortnite'daki haritayı gösterir."),
    async run(interaction) {
        const response = await fetch(`https://fortnite-api.com/v1/map?language=tr`, {
            method: 'GET',
            headers: {
                Authorization: client.config.api_keys.fortniteapicom
            }
        });
        const data = await response.json()
        interaction.reply({ embeds: [new EmbedBuilder().setTitle("Harita").setImage(data.data.images.pois).setColor("#00FF00")] })
    }
}