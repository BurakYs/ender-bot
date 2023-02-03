const { EmbedBuilder, resolveColor } = require("discord.js");
const fetch = require("node-fetch");
module.exports = async (client) => {
  client.once('ready', () => {
    client.user.setActivity("/yardım")
    console.log(`Logged in as ${client.user.tag}`)
  });
  client.on("messageCreate", async message => {
    if (message.channel.id === client.config.channels.itemshop2 && message.author.bot && message.embeds && message.flags.bitfield === 2) {
      if (message.author.id === client.user.id) return;
      client.channels.cache.get(`${client.config.channels.itemshop}`).send({ content: `<@&${client.config.roles.itemshop}>`, embeds: [new EmbedBuilder().setImage(message.embeds[0].data.image.url).setColor("#00FF00")] })
      client.db.delete("fortnite_itemshop")
      await client.db.set("fortnite_itemshop", message.embeds[0].data.image.url)
    }
    if (message.channel.id === client.config.channels.itemshop2 && message.author.bot && message.embeds && message.flags.bitfield === 2) {
      if (message.author.id === client.user.id) return;
      const response = await fetch("https://fortnite-api.com/v2/shop/br/combined?language=tr", {
        method: "get",
        headers: {
          Authorization: client.config.api_keys.fortniteapicom,
        },
      })
      const shop = await response.json()
      let daily = shop.data.daily.entries.map(x => x.items).map(x => x[0].name)
      let featured = shop.data.featured.entries.map(x => x.items).map(x => x[0].name)
      let all = daily.concat(featured)
      await all.forEach(y => {
        client.reminder2.get(`${y.toLowerCase().replaceAll(" ", "-")}`)?.forEach(async x => {
          client.guilds.cache.get(`${client.config.guilds.main.id}`).members.cache.get(x).roles.add(`${client.config.roles.reminder}`)
          client.guilds.cache.get(`${client.config.guilds.main.id}`).members.cache.filter(z => z.roles.cache.has(`${client.config.roles.reminder}`) && z === x).forEach(x => x.roles.remove(`${client.config.roles.reminder}`))
          if (!client.db.has("TEMPDATA")) {
            client.db.set("TEMPDATA", true)
            client.channels.cache.get(`${client.config.channels.itemshop}`).send({
              content: `<@&${client.config.roles.reminder}>`,
              embeds: [
                new EmbedBuilder()
                  .setColor(resolveColor("#00CCFF"))
                  .setTitle("Hatırlatıcı")
                  .setDescription(`Hatırlatıcınıza eklediğiniz bir veya birden fazla kozmetik şimdi içerik mağazasında!`)]
            })
            setTimeout(() => {
              client.db.delete("TEMPDATA")
            }, 120000)
          }
          if (client.db.has(`mesajaldi_${x}`)) {
            return setTimeout(() => {
              client.db.delete(`mesajaldi_${x}`)
            }, 5000)
          }

          client.users.cache.get(x).send({
            embeds: [
              new EmbedBuilder()
                .setColor(resolveColor("#00CCFF"))
                .setTitle("Hatırlatıcı")
                .setDescription(`Hatırlatıcınıza eklediğiniz bir veya birden fazla kozmetik şimdi içerik mağazasında!`)]
          }).catch((e) => { })

          await client.db.set(`mesajaldi_${x}`, true)
        })

      })
    }

  })
}