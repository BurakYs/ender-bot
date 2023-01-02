const { SlashCommandBuilder, EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    command: {
        name: "unmute",
        description: "Üyelerin zamanaşımını kaldır.",
        category: "Moderasyon",
        reqPermMember: "ModerateMembers",
        reqPermBot: "ModerateMembers"
    },
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Üyelerin zamanaşımını kaldır.")
        .setDMPermission(false)
        .addUserOption(option => option.setName("üye").setDescription("Üye").setRequired(true))
        .addStringOption(option => option.setName("sebep").setDescription("Sebep")),
    async run(interaction) {
        const member = interaction.options.getMember("üye")
        if (!member) return client.error(interaction, "Bu üyeyi bulamıyorum.")
        const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi"
        member.timeout(null, `${reason ? `${reason} - ${interaction.user.tag} tarafından zamanaşımı kaldırıldı.` : `Sebep Belirtilmedi. - ${interaction.user.tag} tarafından zamanaşımı kaldırıldı.`}`).catch(err => client.error(interaction, "Üyenin rolü benden yüksek. Susturamam."))
        client.success(interaction, `${member} üyesinin zamanaşımı kaldırıldı.`)
    }
}