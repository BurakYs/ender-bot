const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    command: {
        name: "yardım",
        description: "Yardım menüsünü gönderir.",
        category: "Genel",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('yardım')
        .setDescription("Yardım menüsünü gönderir.")
        .addStringOption((option) => option.setName("kategori").setDescription("Belirttiğiniz kategorinin yardım menüsünü atar").setRequired(false)
            .addChoices(
                { name: "Genel", value: "genel" },
                { name: "Sunucu", value: "sunucu" },
                { name: "Eğlence", value: "eglence" },
                { name: "Moderasyon", value: "moderasyon" },
                { name: "Fortnite", value: "fortnite" },

            )),
    async run(interaction) {
        const kategori = interaction.options.getString("kategori")
        if (!kategori) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Yardım Komutları', iconURL: interaction.user.displayAvatarURL() })
                    .setThumbnail(client.user.avatarURL())
                    .setColor('#FFFB05')
                    .setDescription(`**Örnek Kullanım:** \`/yardım kategori: Kategori\` \n **Örnek:** \`/yardım kategori: Genel\``)
                    .addFields(
                        {
                            name: 'Kategoriler:', value: `
**[/yardım kategori: Genel](${client.config.guilds.main.invite})** 
**[/yardım kategori: Eğlence](${client.config.guilds.main.invite})**
**[/yardım kategori: Moderasyon](${client.config.guilds.main.invite})**
**[/yardım kategori: Sunucu](${client.config.guilds.main.invite})**
**[/yardım kategori: Fortnite](${client.config.guilds.main.invite})**
       `},
                        { name: "Linkler", value: `[Davet Et](${client.config.bot.invite}) **|** [Destek Sunucusu](${client.config.guilds.main.invite})` })
                ]
            })
        }

        if (kategori === "genel") {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Genel', iconURL: interaction.user.displayAvatarURL() })
                    .setColor('#2667FF')
                    .setDescription(client.commands.filter(cmd => cmd.command.category === 'Genel').map(cmd => `**/${cmd.command.name}** - ${cmd.command.description}`).join("\n"))
                    .addFields(
                        { name: "Linkler", value: `[Davet Et](${client.config.bot.invite}) **|** [Destek Sunucusu](${client.config.guilds.main.invite})` }
                    )
                ]
            })
        }
        if (kategori === "sunucu") {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Sunucu', iconURL: interaction.user.displayAvatarURL() })
                    .setColor('#2667FF')
                    .setDescription(client.commands.filter(cmd => cmd.command.category === 'Sunucu').map(cmd => `**/${cmd.command.name}** - ${cmd.command.description}`).join("\n"))
                    .addFields(
                        { name: "Linkler", value: `[Davet Et](${client.config.bot.invite}) **|** [Destek Sunucusu](${client.config.guilds.main.invite})` }
                    )
                ]
            })
        }
        if (kategori === "eglence") {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Eğlence', iconURL: interaction.user.displayAvatarURL() })
                    .setColor('#2667FF')
                    .setDescription(client.commands.filter(cmd => cmd.command.category === 'Eğlence').map(cmd => `**/${cmd.command.name}** - ${cmd.command.description}`).join("\n"))
                    .addFields(
                        { name: "Linkler", value: `[Davet Et](${client.config.bot.invite}) **|** [Destek Sunucusu](${client.config.guilds.main.invite})` }
                    )
                ]
            })
        }
        if (kategori === "moderasyon") {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Moderasyon', iconURL: interaction.user.displayAvatarURL() })
                    .setColor('#2667FF')
                    .setDescription(client.commands.filter(cmd => cmd.command.category === 'Moderasyon').map(cmd => `**/${cmd.command.name}** - ${cmd.command.description}`).join("\n"))
                    .addFields(
                        { name: "Linkler", value: `[Davet Et](${client.config.bot.invite}) **|** [Destek Sunucusu](${client.config.guilds.main.invite})` }
                    )
                ]
            })
        }
        if (kategori === "fortnite") {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: 'Fortnite', iconURL: interaction.user.displayAvatarURL() })
                    .setColor('#2667FF')
                    .setDescription(client.commands.filter(cmd => cmd.command.category === 'Fortnite').map(cmd => `**/${cmd.command.name}** - ${cmd.command.description}`).join("\n"))
                    .addFields(
                        { name: "Linkler", value: `[Davet Et](${client.config.bot.invite}) **|** [Destek Sunucusu](${client.config.guilds.main.invite})` }
                    )
                ]
            })
        }
    }
};