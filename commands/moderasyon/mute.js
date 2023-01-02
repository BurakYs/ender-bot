const { SlashCommandBuilder } = require("discord.js");
const ms = require("ms");
module.exports = {
    command: {
        name: "mute",
        description: "Üyeleri sustur.",
        category: "Moderasyon",
        reqPermMember: "ModerateMembers",
        reqPermBot: "ModerateMembers"
    },
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("Üyeleri sustur.")
        .setDMPermission(false)
        .addUserOption(option => option.setName("üye").setDescription("Susturulacak üye").setRequired(true))
        .addStringOption(option => option.setName("süre").setDescription("Susturmanın uzunluğu").setRequired(true))
        .addStringOption(option => option.setName("sebep").setDescription("Sebep")),
    async run(interaction) {
        const member = interaction.guild.members.cache.get(interaction.options.getUser("üye").id)
        if (!member) return client.error(interaction, "Bu üyeyi bulamıyorum.")
        let duration = interaction.options.getString("süre")
        const reason = interaction.options.getString("sebep") || "Sebep belirtilmedi"
        if (!ms(duration) || ms(duration) === undefined) return client.error(interaction, "Süre geçersiz.")
        if (ms(duration) || ms(duration) !== undefined) {
            member.timeout(ms(duration), `${reason ? `${reason} - ${interaction.user.tag} tarafından zamanaşımı uygulandı.` : `Sebep Belirtilmedi. - ${interaction.user.tag} tarafından zamanaşımı uygulandı.`}`).catch(err => client.error(interaction, "Üyenin rolü benden yüksek. Susturamam."))
            client.success(interaction, `${member}, ${duration} süreliğine ${reason} sebebiyle susturuldu.`)
        }
    }

}