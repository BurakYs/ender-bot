const { EmbedBuilder, SlashCommandBuilder, resolveColor } = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
    command: {
        name: "reminder",
        description: "Hatırlatıcı oluştur",
        category: "Fortnite",
        slowmode: 5000,
        reqPermMember: "NONE",
        reqPermBot: "NONE",
    },
    data: new SlashCommandBuilder()
        .setName("reminder")
        .setDescription("Hatırlatıcı oluştur")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Hatırlatıcına bir kozmetik ekle")
                .addStringOption((option) =>
                    option
                        .setName("kozmetik")
                        .setDescription("Ingilizce Kozmetik Adı")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("Hatırlatıcından bir kozmetik çıkar")
                .addStringOption((option) =>
                    option
                        .setName("kozmetik")
                        .setDescription("Ingilizce Kozmetik Adı")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("list").setDescription("Hatırlatıcını görüntüle")
        ),
    async run(interaction) {
        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }

        if (interaction.options.getSubcommand() === "add") {
            const name = interaction.options.getString("kozmetik");
            const responsee = await fetch(
                `https://fortnite-api.com/v2/cosmetics/br/search?name=${name}`,
                {
                    method: "get",
                    headers: {
                        Authorization: client.config.api_keys.fortniteapicom,
                    },
                }
            );
            const { status } = responsee;
            const response = await responsee.json();
            const allcosm = await fetch(
                `https://fortnite-api.com/v2/cosmetics/br`,
                {
                    method: "get",
                    headers: {
                        Authorization: client.config.api_keys.fortniteapicom,
                    },
                }
            )
            const responseall = await allcosm.json()
            const cosmetics = responseall.data.map(x => x.name).map(x => x)
            const similar = require("string-similarity").findBestMatch(titleCase(name), cosmetics)
            if (status === 404)
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Hata")
                            .setColor("Red")
                            .setDescription(`${titleCase(name)} isminde bir kozmetik bulunamadı. Aramanızla eşleşen en iyi sonuç: **${similar.bestMatch.target}**`),
                    ],
                });
            if (status === 200) {
                if (!client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`)?.includes(titleCase(name))) {

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${titleCase(name)}`)
                                .setColor("#00CCFF")
                                .setDescription(`${titleCase(name)} hatırlatıcınıza eklendi. `)
                                .setThumbnail(response.data.images.smallIcon),
                        ],
                    }) && client.reminder.push(`reminder_${interaction.user.id}_${response.data.type.value}`, titleCase(name)) && client.reminder2.push(`${response.data.name.replace(" ", "-").toLowerCase()}`, interaction.user.id)
                }
                if (client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`)?.includes(titleCase(name))) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Hata")
                                .setColor("Red")
                                .setDescription("Bu kozmetik zaten hatırlatıcınızda bulunuyor.")
                                .setThumbnail(response.data.images.smallIcon),
                        ]
                    })
                }
            }

        }
        if (interaction.options.getSubcommand() === "remove") {
            const name = interaction.options.getString("kozmetik");
            const responsee = await fetch(
                `https://fortnite-api.com/v2/cosmetics/br/search?name=${name}`,
                {
                    method: "get",
                    headers: {
                        Authorization: client.config.api_keys.fortniteapicom,
                    },
                }
            )
            const { status } = responsee;
            const response = await responsee.json();
            if (status === 404)
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Hata")
                            .setColor("Red")
                            .setDescription("${titleCase(name)} isminde bir kozmetik bulunamadı."),
                    ],
                });
            if (status === 200) {
                if (!client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`).includes(titleCase(name))) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Hata")
                                .setColor("Red")
                                .setDescription("Bu kozmetik zaten hatırlatıcınızda bulunmuyor.")
                        ]
                    })
                } else {


                    const array2 = client.reminder2.get(`${response.data.name.replace(" ", "-").toLowerCase()}`)
                    const index2 = array2.indexOf(name)
                    if (index2 === 0) { array2.shift() } else {
                        array2.splice(index2, index2)
                    }
                    const array = client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`)
                    const index = array.indexOf(titleCase(name))
                    if (index === 0) { array.shift() } else {
                        array.splice(index, index)
                    }
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    `${titleCase(name)}`
                                )
                                .setColor("Red")
                                .setDescription(
                                    `${titleCase(name)} hatırlatıcınızdan kaldırıldı.`
                                )
                                .setThumbnail(response.data.images.smallIcon),
                        ],
                    }) && client.reminder.set(`reminder_${interaction.user.id}_${response.data.type.value}`, array) && client.reminder2.set(`${response.data.name.replace(" ", "-").toLowerCase()}`, array2)
                }
            }

        }
        if (interaction.options.getSubcommand() === "list") {
            try {
                if (client.reminder.get(`reminder_${interaction.user.id}_outfit`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_pickaxe`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_backpack`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_glider`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_emote`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_loadingscreen`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_emoji`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_spray`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_contrail`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_music`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_toy`) === null
                    && client.reminder.get(`reminder_${interaction.user.id}_wrap`) === null) return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Hata")
                                .setColor("Red")
                                .setDescription(`Hatırlatıcınızda herhangi bir kozmetik yok.`),
                        ],
                    })
                const embed = new EmbedBuilder()
                    .setTitle("Hatırlatıcı Listesi")
                    .setColor("#00CCFF")
                if (client.reminder.has(`reminder_${interaction.user.id}_outfit`)) embed.addFields({ name: "Kostümler", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_outfit`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_pickaxe`)) embed.addFields({ name: "Toplama Aletleri", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_pickaxe`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_backpack`)) embed.addFields({ name: "Sırt Çantaları", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_backpack`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_glider`)) embed.addFields({ name: "Planörler", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_glider`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_emote`)) embed.addFields({ name: "Danslar", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_emote`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_loadingscreen`)) embed.addFields({ name: "Yükleme Ekranları", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_loadingscreen`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_emoji`)) embed.addFields({ name: "Emojiler", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_emoji`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_wrap`)) embed.addFields({ name: "Kaplamalar", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_wrap`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_spray`)) embed.addFields({ name: "Spreyler", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_spray`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_contrail`)) embed.addFields({ name: "Dalış İzleri", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_contrail`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_music`)) embed.addFields({ name: "Müzikler", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_music`).join("\n")}\`\`\``, inline: true })
                if (client.reminder.has(`reminder_${interaction.user.id}_toy`)) embed.addFields({ name: "Oyuncaklar", value: `\`\`\`\n${client.reminder.get(`reminder_${interaction.user.id}_toy`).join("\n")}\`\`\``, inline: true })
                return interaction.reply({
                    embeds: [embed], fetchReply: true
                })
            } catch (e) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Hata")
                            .setColor("Red")
                            .setDescription(`Hatırlatıcınızda herhangi bir kozmetik yok.`),
                    ],
                })
            }
        }
    },
};
