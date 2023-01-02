module.exports = {
    bot: {
        admins: [], /*Bot yöneticilerinin idleri*/
        token: ""
    },
    api_keys: {
        fortniteapicom: "", /*https://fortnite-api.com*/
        fnbrco: "" /*https://fnbr.co*/
    },
    channels: {
        itemshop: "", /*Günlük içerik mağazasının gönderileceği kanal*/
        itemshop2: "", /*Başka bir sunucudan gelen içerik mağazası embedlerinin olduğu kanal*/
        news: "" /*Fortnite haberlerinin gönderileceği kanal*/
    },
    roles: {
        itemshop: "", /*Günlük içerik mağazası gönderildiğinde etiketlenecek rol*/
        reminder: "" /*Günlük içerik mağazası gönderildiğinde hatırlatıcılarındaki kozmetikler içerik mağazasında varsa onları bildirmek için etiketlenecek rol*/
    },
    guilds: {
        main: {
            id: "",
            invite: ""
        }
    }
}
