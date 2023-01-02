const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require("moment")
require('moment-duration-format');
module.exports = {
    command: {
        name: "kullanıcı-bilgi",
        description: "Kullanıcı hakkında bilgi verir.",
        category: "Genel",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('kullanıcı-bilgi')
        .setDescription("Kullanıcı hakkında bilgi verir.")
        .addUserOption((option) => option.setName("üye").setDescription("Bilgileri alınacak üye").setRequired(false)),
    async run(interaction) {

        var user = interaction.options.getUser("üye")?.id || interaction.user.id
        const member = interaction.guild.members.cache.get(user)

        moment.locale('tr-TR');
        var userRoles
        if (member.roles.cache.size > 1) {
            userRoles = member.roles.cache.sort((a, b) => b.position - a.position).filter(x => x.name !== "@everyone").map(x => `<@&${x.id}>`).join(" | ")
        } else {
            userRoles = '`Bulunmuyor`'
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.users.cache.get(user).tag, iconURL: client.users.cache.get(user).displayAvatarURL() })
            .setThumbnail(client.users.cache.get(user).displayAvatarURL())
            .setColor("#00CCFF")
            .addFields(
                {
                    name: 'Üye bilgisi:', value: `
**Kullanıcı İsmi:** ${member.displayName}
**Katılım Tarihi:** <t:${Math.floor(interaction.guild.members.cache.get(user).joinedTimestamp / 1000)}:f>
**Rolleri:** ${userRoles}`
                },
                {
                    name: 'Kullanıcı bilgisi:', value: `
**Tag**: ${member.user.tag}
**ID:** ${member.user.id}
**Kuruluş Tarihi**: <t:${Math.floor(client.users.cache.get(user).createdTimestamp / 1000)}:f>`
                })
        return interaction.reply({ embeds: [embed] })
    }
}