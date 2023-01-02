const config = require('./../config.js');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { EmbedBuilder, OAuth2Scopes, resolveColor } = require("discord.js");

module.exports = class extends Client {

  constructor() {
    super({

      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent
      ],

      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.ThreadMember, Partials.GuildScheduledEvent],

      ws: {
        version: "10"
      }
    });
    function error(asd, desc, ephemeral) {
      asd.reply({
        embeds: [new EmbedBuilder()
          .setTitle("Hata")
          .setColor(resolveColor("Red"))
          .setDescription(desc)
        ],
        ephemeral: ephemeral || false
      })
    }
    function success(asd, desc, ephemeral) {
      asd.reply({
        embeds: [new EmbedBuilder()
          .setTitle("Başarılı")
          .setColor(resolveColor("Green"))
          .setDescription(desc)
        ],
        ephemeral: ephemeral || false
      })
    }
    this.success = success
    this.error = error
    this.config = config;
    this.commands = new Collection();
    const { JsonDatabase } = require("wio.db");
    this.reminder = new JsonDatabase({ databasePath: "./databases/reminder/r1.json" });
    this.reminder2 = new JsonDatabase({ databasePath: "./databases/reminder/r2.json" });
    this.db = new JsonDatabase({ databasePath: "./databases/db.json" })
    const client = this
    global.client = client

    process.on("unhandledRejection", (reason, promise) => { console.log(reason, promise) })
    process.on("uncaughtException", (err) => { console.log(err) })
    process.on("uncaughtExceptionMonitor", (err) => { console.log(err) })
  }

  loader() {

    require('../handlers/eventHandler.js')(this);
    require('../loaders/command.js')(this);
    require("../loaders/listeners.js")(this);
    this.login(config.bot.token).catch(e => console.log(e))
  };
};
