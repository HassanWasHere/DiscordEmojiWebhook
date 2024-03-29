const {Client, GatewayIntentBits, MembershipScreeningFieldType} = require("discord.js");
const cluster = require("cluster");
require('dotenv').config();

if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
    });
} else {

    const client = new Client({
        intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    var emoteServers = [
        '1112116445787214014',
        '1029015002214051910',
        '1082973848468734013',
	'995672423330488330',
    ];


    function findEmoji(Name)
    {
        return new Promise((resolve, reject) => {
            emoteServers.forEach((GuildID) => {
                var Guild = client.guilds.cache.get(GuildID);
                Guild.emojis.cache.forEach((Emoji) => {
                    if (Emoji.name.toLowerCase() == Name.toLowerCase()){
                        resolve(Emoji);
                    }
                });
            })
        })
    }

    function parseString(finalString)
    {
        return new Promise((resolve, reject) => {
            const regex = /:(?![0-9])([^:]+?):(?!([0-9]))/;
            var result = regex.exec(finalString);
            if (result)
            {
                findEmoji(result[1]).then(function(Emoji){
                    var replacement = `${Emoji}`;
                    finalString = finalString.substring(0, result.index) + replacement + finalString.substring(result.index + result[0].length);
                    if (regex.exec(finalString)){
                        resolve(parseString(finalString));
                    } else {
                        resolve(finalString);
                    }
                })
                
            } else {
                resolve(finalString);
            }
        })
        
        
    }

    client.on("messageCreate", (msg) => {
        if (msg.member && !msg.member.user.bot){
            parseString(msg.content).then((str) => {
                if (msg.content != str)
                {
                    msg.channel.createWebhook({ name:msg.member.displayName, avatar: msg.member.avatarURL() || msg.author.avatarURL() })
                    .then(wb => {
                        wb.send(str).then(()=> wb.delete());
                    })
                    .catch(console.error);
                    msg.delete();
                }
            });
        }
    });

    client.on("ready", () => {
        console.log("Ready");
    });

    if (process.env.TOKEN){
        client.login(process.env.TOKEN);
    }
}
