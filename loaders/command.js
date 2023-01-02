
const { glob } = require('glob');
const { promisify } = require('util');
const fs = require('fs');
const { EmbedBuilder } = require("discord.js")
const fetch = require('node-fetch');
module.exports = async (client) => {
    const cmds = await promisify(glob)("./commands/*/*.js");
    const commands = [];
    cmds.map((value) => {
        let file = require(`.${value}`);
        commands.push(file.data.toJSON());
        client.commands.set(file.data.name, file);
    });

    client.once('ready', async () => {
        const response = await fetch(`https://fortnite-api.com/v2/news?language=tr`, {
            method: "get",
            headers: {
                Authorization: client.config.api_keys.fortniteapicom,
            },
        });
        const data = await response.json();
        client.channels.cache.get(client.config.channels.news).send(
            {
                embeds: [new EmbedBuilder()
                    .setTitle("Haberler")
                    .setImage(data.data?.br?.image)
                    .setColor("#00FF00")]
            }
        );
        setInterval(async () => {
            const response = await fetch(`https://fortnite-api.com/v2/news?language=tr`, {
                method: "get",
                headers: {
                    Authorization: client.config.api_keys.fortniteapicom,
                },
            });
            const data = await response.json();
            client.channels.cache.get(client.config.channels.news).send(
                {
                    embeds: [new EmbedBuilder()
                        .setTitle("Haberler")
                        .setImage(data.data.br.image)
                        .setColor("#00FF00")]
                }
            );
        }, 28800000)
        try {
            client.application.commands.set(commands).then(() => {
                console.log("Komutlar Yüklendi")
            })

        } catch (error) {
            console.log(error)
        }
    });
};
