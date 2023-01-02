const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, Modal, TextInputBuilder, SlashCommandBuilder, resolveColor } = require("discord.js")
const fetch = require("node-fetch")
module.exports = {
    command: {
        name: "eval",
        description: "a",
        category: "Owner",
        slowmode: 1,
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription("A")
        .addStringOption((option) => option.setName('code').setDescription('Code').setRequired(true)),
    async run(interaction) {
        try {
            if (!client.config.bot.admins.includes(interaction.user.id)) return;
            let code = interaction.options.getString('code')
            let evaled = eval(code)
            let tip = typeof (evaled)
            function ping() { fetch(process.env.maichi) }

            evaled = require('util').inspect(evaled)
            await interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00CCFF")
                        .setDescription(`\`\`\`js\n${evaled.length > 1000 ? `${evaled.slice(0, 1000)}...` : `${clean(evaled)}`}\`\`\``),
                ],
            });


        } catch (err) {

            interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00CCFF")
                        .addFields({ name: 'Error', value: `\`\`\`js\n${clean(err).length > 1000 ? `${clean(err).slice(0, 1000)}...` : `${clean(err)}`}\n\`\`\`` }),
                ],
            });
        };

        function clean(text) {

            if (typeof (text) == 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
            else
                return text
        };

    }
}