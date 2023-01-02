const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
    command: {
        name: "haberler",
        description: "Fortnite'daki haberleri gösterir.",
        category: "Fortnite",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('haberler')
        .setDescription("Fortnite'daki haberleri gösterir.")
        .addStringOption((option) => option.setName("oyun-modu").setDescription("Oyun Modu").setRequired(true)
            .addChoices(
                { name: "Battle Royale", value: "br" },
                { name: "Save the World", value: "stw" }

            ))
    ,
    async run(interaction) {
        const response = await fetch(`https://fortnite-api.com/v2/news?language=tr`, {
            method: "get",
            headers: {
                Authorization: client.config.api_keys.fortniteapicom,
            },
        });
        const data = await response.json();
        if (interaction.options.getString("oyun-modu") === "br") {
            interaction.reply(
                {
                    embeds: [new EmbedBuilder()
                        .setTitle("Haberler")
                        .setImage(data.data.br.image)
                        .setColor("#00FF00")]
                }
            );
        }
        if (interaction.options.getString("oyun-modu") === "stw") {
            if (!data.data.stw.image)
                return interaction.reply({content: "Dünyayı kurtar modunda haber bulunamadı."});
                interaction.reply(
                    {
                        embeds: [new EmbedBuilder()
                            .setTitle("Haberler")
                            .setImage(data.data.stw.image)
                            .setColor("#00FF00")]
                    }
                );
        }
    }
}