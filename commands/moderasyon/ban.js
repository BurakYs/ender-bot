const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    command: {
        name: "ban",
        description: "Belirttiğiniz kişiyi sunucudan yasaklar.",
        category: "Moderasyon",
        reqPermMember: "BanMembers",
        reqPermBot: "BanMembers"
    },
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Belirttiğiniz kişiyi sunucudan yasaklar.")
        .addUserOption((option) => option.setName("üye").setDescription("Yasaklanacak üye").setRequired(true))
        .addStringOption((option) => option.setName("sebep").setDescription("Yasaklanma sebebi").setRequired(false)),
    async run(interaction) {
        let user = interaction.options.getUser("üye")
        let reason = `${interaction.options.getString("sebep") ? interaction.options.getString("sebep") : "Belirtilmemiş"} - ${interaction.user.tag} tarafından yasaklandı.`
        if (user.id === interaction.user.id) return interaction.reply({ content: "Kendini yasaklayamazsın." });
        if (interaction.guild.members.cache.get(interaction.user.id).roles.highest.position <= interaction.guild.members.cache.get(user.id)?.roles.highest.position) return interaction.reply({ content: `Bu kullanıcının senin rollerinden daha yüksek rolü var.` });
        if (interaction.guild.members.cache.get(user.id) && !interaction.guild.members.cache.get(user.id)?.bannable) return interaction.reply({ content: 'Sunucudaki yetkilileri yasaklayamam!' });
        interaction.guild.members.ban(user.id, { reason: reason })
        await interaction.reply({ content: `${user} yasaklandı.` })
    }
};