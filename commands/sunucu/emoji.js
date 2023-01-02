const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    command: {
        name: "emojiler",
        description: "Sunucudaki tüm emojileri gösterir.",
        category: "Sunucu",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('emojiler')
        .setDescription("Sunucudaki tüm emojileri gösterir."),
    async run(interaction) {
        let animEmotes = [],
            staticEmotes = [];
        var guild = interaction.guild
        guild.emojis.cache.forEach((e) => {
            e.animated ? animEmotes.push(`<a:${e.name}:${e.id}>`) : staticEmotes.push(`<:${e.name}:${e.id}>`);
        });
        staticEmotes = staticEmotes.length !== 0 ? `__**[${staticEmotes.length}] Normal Emoji**__\n${staticEmotes.join('')}` : '\n**Normal Emoji Bulunmuyor**';
        animEmotes = animEmotes.length !== 0 ? `\n\n__**[${animEmotes.length}] Hareketli Emoji**__\n${animEmotes.join('')}` : '\n**Hareketli Emoji Bulunmuyor**';
        try {
            let botembed = new EmbedBuilder()
                .setColor(`Random`)
                .setDescription(staticEmotes + animEmotes)
                .setAuthor({ name: `${interaction.guild.name} Sunucusu Emojileri`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()
            return interaction.reply({ embeds: [botembed] })
        } catch (err) {
            console.log(err)
            const embed = new EmbedBuilder()
                .setTitle("Hata")
                .setDescription("Bir hata oluştu ve emojiler gösterilemedi.")
                .setColor('Red')
            interaction.reply({ embeds: [embed] })

        }

    }
}