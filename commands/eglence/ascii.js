const figlet = require("figlet")
const { SlashCommandBuilder} = require("discord.js");
module.exports = {
    command: {
        name: "ascii",
        description: "Ascii şeklinde yazı yazarsınız.",
        category: "Eğlence",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription("Ascii şeklinde yazı yazarsımız.")
        .addStringOption((option) => option.setName("yazı").setDescription("Ascii olarak yazılacak yazı").setRequired(true)),
    async run(interaction) {
        if (interaction.options.getString("yazı").length > 75) return interaction.reply({ content: `En fazla **75** karakter yazabilirsiniz.` })
        figlet(`${interaction.options.getString("yazı")}`, function (err, data) {
            if (err) {
                return;
            }

            interaction.reply({
                content: `
\`\`\`AsciiArt
${data}
\`\`\`
`});

        });
    }
};