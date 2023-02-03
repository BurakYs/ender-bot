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
        await interaction.deferReply()
        function titleCase(str) {
            var splitStr = str?.toLowerCase()?.split(' ');
            for (var i = 0; i < splitStr?.length; i++) {
                splitStr[i] = splitStr[i]?.charAt(0)?.toUpperCase() + splitStr[i]?.substring(1);
            }
            return splitStr?.join(' ');
        }

        if (interaction.options.getSubcommand() === "add") {
            const name = interaction.options.getString("kozmetik");
            let responsee = await fetch(
                `https://fortnite-api.com/v2/cosmetics/br/search?name=${name}&language=tr`,
                {
                    method: "get",
                    headers: {
                        Authorization: client.config.api_keys.fortniteapicom,
                    },
                }
            );
            const allcosm = await fetch(
                `https://fortnite-api.com/v2/cosmetics/br?language=tr`,
                {
                    method: "get",
                    headers: {
                        Authorization: client.config.api_keys.fortniteapicom,
                    },
                }
            )
            const allcosm2 = await fetch(
                `https://fortnite-api.com/v2/cosmetics/br`,
                {
                    method: "get",
                    headers: {
                        Authorization: client.config.api_keys.fortniteapicom,
                    },
                }
            )
            let response = await responsee.json();
            if (response.status === 404) {
                responsee = await fetch(
                    `https://fortnite-api.com/v2/cosmetics/br/search?name=${name}&searchLanguage=tr&language=tr`,
                    {
                        method: "get",
                        headers: {
                            Authorization: client.config.api_keys.fortniteapicom,
                        },
                    }
                );
                response = await responsee.json();
            }
            const responseall = await allcosm.json()
            const cosmetics = responseall.data.map(x => x.name).map(x => x)
            const responseall2 = await allcosm2.json()
            const cosmetics2 = responseall2.data.map(x => x.name).map(x => x)
            const similar = require("string-similarity").findBestMatch(titleCase(name), cosmetics)
            const similar2 = require("string-similarity").findBestMatch(titleCase(name), cosmetics2)
            if (response.status === 404)
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Hata")
                            .setColor("Red")
                            .setDescription(`${titleCase(name)} isminde bir kozmetik bulunamadı. Aramanızla eşleşen en iyi Türkçe sonuç: **${similar.bestMatch.target}** | İngilizce sonuç: **${similar2.bestMatch.target}**`),
                    ],
                });

            if (response.status === 200) {
                if (!client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`)?.includes(titleCase(response?.data?.name))) {

                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${titleCase(response?.data?.name)}`)
                                .setColor("#00CCFF")
                                .setDescription(`${titleCase(response?.data?.name)} hatırlatıcınıza eklendi. `)
                                .setThumbnail(response.data.images.smallIcon),
                        ],
                    }) && client.reminder.push(`reminder_${interaction.user.id}_${response.data.type.value}`, titleCase(response?.data?.name)) && client.reminder2.push(`${response?.data?.name.replace(" ", "-").toLowerCase()}`, interaction.user.id)
                }
                if (client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`)?.includes(titleCase(response?.data?.name))) {
                    return await interaction.editReply({
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
            if (response.status === 404)
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Hata")
                            .setColor("Red")
                            .setDescription("${titleCase(response?.data?.name)} isminde bir kozmetik bulunamadı."),
                    ],
                });
            if (response.status === 200) {
                if (!client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`).includes(titleCase(response?.data?.name))) {
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Hata")
                                .setColor("Red")
                                .setDescription("Bu kozmetik zaten hatırlatıcınızda bulunmuyor.")
                        ]
                    })
                } else {


                    const array2 = client.reminder2.get(`${response?.data?.name.replace(" ", "-").toLowerCase()}`)
                    const index2 = array2.indexOf(name)
                    if (index2 === 0) { array2.shift() } else {
                        array2.splice(index2, index2)
                    }
                    const array = client.reminder.get(`reminder_${interaction.user.id}_${response.data.type.value}`)
                    const index = array.indexOf(titleCase(response?.data?.name))
                    if (index === 0) { array.shift() } else {
                        array.splice(index, index)
                    }
                    return await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(
                                    `${titleCase(response?.data?.name)}`
                                )
                                .setColor("Red")
                                .setDescription(
                                    `${titleCase(response?.data?.name)} hatırlatıcınızdan kaldırıldı.`
                                )
                                .setThumbnail(response.data.images.smallIcon),
                        ],
                    }) && client.reminder.set(`reminder_${interaction.user.id}_${response.data.type.value}`, array) && client.reminder2.set(`${response?.data?.name.replace(" ", "-").toLowerCase()}`, array2)
                }
            }

        }
        if (interaction.options.getSubcommand() === "list") {
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
            if (!embed.data) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Hata")
                        .setColor("Red")
                        .setDescription(`Hatırlatıcınızda herhangi bir kozmetik yok.`),
                ],
            })
            return await interaction.editReply({
                embeds: [embed]
            })


        }
    },
};
