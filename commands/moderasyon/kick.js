const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    command: {
        name: "kick",
        description: "Belirttiğiniz kişiyi sunucudan atar.",
        category: "Moderasyon",
        reqPermMember: "KickMembers",
        reqPermBot: "KickMembers"
    },
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription("Belirttiğiniz kişiyi sunucudan atar.")
        .addUserOption((option) => option.setName("üye").setDescription("Atılacak üye").setRequired(true))
        .addStringOption((option) => option.setName("sebep").setDescription("Atılma sebebi").setRequired(false)),
    async run(interaction) {
        let user = interaction.options.getUser("üye")
        let reason = `${interaction.options.getString("sebep") ? interaction.options.getString("sebep") : "Belirtilmemiş"} - ${interaction.user.tag} tarafından atıldı.`
        if (user.id === interaction.user.id) return interaction.reply({ content: "Kendini atamazsın." });
        if (interaction.guild.members.cache.get(interaction.user.id).roles.highest.position <= interaction.guild.members.cache.get(user.id)?.roles.highest.position) return interaction.reply({ content: `Bu kullanıcının senin rollerinden daha yüksek rolü var.` });
        if (!reason) reason = 'Belirtilmemiş.'
        let member = interaction.guild.member(user)
        if (interaction.guild.members.cache.get(user.id) && !interaction.guild.members.cache.get(user.id)?.kickable) return interaction.reply({ content: 'Sunucudaki yetkilileri atamam!' });
        interaction.guild.members.kick(user.id, { reason: reason })
        await interaction.reply({ content: `${user} atıldı.` })
    }
};