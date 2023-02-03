const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
module.exports = {
    command: {
        name: "kozmetik",
        description: "Fortnite'daki belirttiğin kozmetiğin bilgilerini gösterir.",
        category: "Fortnite",
        reqPermMember: "NONE",
        reqPermBot: "NONE"
    },
    data: new SlashCommandBuilder()
        .setName('kozmetik')
        .setDescription("Fortnite'daki belirttiğin kozmetiğin bilgilerini gösterir.")
        .addStringOption((option) => option.setName("kozmetik").setDescription("Kozmetiğin Türkçe adı").setRequired(true)),
    async run(interaction) {
        const kozm = interaction.options.getString("kozmetik")
        let response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/search/all?name=${kozm}&language=tr`, {
            method: 'GET',
            headers: {
                Authorization: client.config.api_keys.fortniteapicom
            }
        });

        let data = await response.json()
        function titleCase(str) {
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }
        if ([404, 400].includes(data.status)) {
            response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/search/all?name=${kozm}&language=tr&searchLanguage=tr`, {
                method: 'GET',
                headers: {
                    Authorization: client.config.api_keys.fortniteapicom
                }
            });
            data = await response.json()
        }
        if ([404, 400].includes(data.status)) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("Hata").setColor("Red").setDescription(`${titleCase(kozm)} isminde bir kozmetik bulunamadı.`)] })
        let color;
        if (data.data[0].rarity.displayValue === "MARVEL SERİSİ") color = "#FF0000"
        if (data.data[0].rarity.displayValue === "DC SERİSİ") color = "#324151"
        if (data.data[0].rarity.displayValue === "KARA SERİ") color = "#ba25c0"
        if (data.data[0].rarity.displayValue === "Yıldızlar Serisi") color = "#2eb3b7"
        if (data.data[0].rarity.displayValue === "Star Wars İçerikleri") color = "#2eb3b7"
        if (data.data[0].rarity.displayValue === "Lav Serisi") color = "#eb8521"
        if (data.data[0].rarity.displayValue === "Oyun Efsaneleri Serisi") color = "#75449f"
        if (data.data[0].rarity.displayValue === "Mavi Gazoz Serisi") color = "#0cb9e7"
        if (data.data[0].rarity.displayValue === "Karanlık Serisi") color = "#27292a"
        if (data.data[0].rarity.displayValue === "Donmuş Seri") color = "#b1d3e8"
        if (data.data[0].rarity.displayValue === "Yaygın") color = "#8b9399"
        if (data.data[0].rarity.displayValue === "Sıradışı") color = ""
        if (data.data[0].rarity.displayValue === "Nadir") color = "#3d9bf7"
        if (data.data[0].rarity.displayValue === "Destansı") color = "#6c3f9e"
        if (data.data[0].rarity.displayValue === "Efsanevi") color = "#da791d"

        interaction.reply({
            embeds: [new EmbedBuilder().setTitle(`${titleCase(data.data[0].name.toLowerCase())}`)
                .addFields(
                    { name: "İsim", value: `${titleCase(data.data[0].name.toLowerCase())}` },
                    { name: "Açıklama", value: `${data.data[0].description}` },
                    { name: "Geldiği Sezon", value: `${data.data[0].introduction.chapter}. Bölüm ${data.data[0].introduction.season}. sezon` },
                    { name: "Tür", value: `${data.data[0].type.displayValue}` },
                    { name: "Seri", value: `${data.data[0].series ? `${titleCase(data.data[0].series.value.toLowerCase())}` : "Seri Yok"}` },
                    { name: "Set", value: `${data.data[0].set ? `${titleCase(data.data[0].set.value.toLowerCase())}` : "Set Yok"}` },
                    { name: "Nadirlik", value: `${titleCase(data.data[0].rarity.displayValue.toLowerCase())}` },

                ).setThumbnail(data.data[0].images.smallIcon).setColor(color)]
        })
    }
}