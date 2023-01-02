const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    command: {
        name: "sunucu-bilgi",
        description: "Sunucu hakkında bilgi verir.",
        category: "Sunucu",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('sunucu-bilgi')
        .setDescription("Sunucu hakkında bilgi verir."),
    async run(interaction) {

        function checkDays(date) {
            let now = new Date();
            let diff = now.getTime() - date.getTime();
            let days = Math.floor(diff / 86400000);
            return days + (days == 1 ? " gün" : " gün") + " önce";
        };
        let guild = interaction.guild
        let serverSize = interaction.guild.memberCount;
        let botCount = interaction.guild.members.cache.filter(m => m.user.bot).size;
        let humanCount = serverSize - botCount;
        let sunucu = new EmbedBuilder()
            .setAuthor({ name: 'Sunucu Bilgi', iconURL: interaction.guild.iconURL() })
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: 'Sunucu Bilgileri', value: `Sunucu İsmi: **${guild.name}** \nSunucu ID: **${interaction.guild.id}** \nSunucu Sahibi: <@${guild.ownerId}> \nKuruluş Tarihi: **${checkDays(interaction.guild.createdAt)}** ` },
                { name: 'Üye Bilgileri', value: `Toplam Üye: **${humanCount}** \nToplam Bot: **${botCount}** \nRol Sayısı: **${guild.roles.cache.size}**` }
            )
            .setColor('#D2EE07')
        await interaction.reply({ embeds: [sunucu] });
    }
}