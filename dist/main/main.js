"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.tricks = require("./../../DATA/tricks.json");
global.glyphpages = require("./../../DATA/glyphpages.json");
if (!("settings" in global)) {
    global.settings = require("./../../ress/settings.json");
}
const cluster = require("cluster");
const Discord = require("discord.js");
const handler_1 = require("../handler");
const modules_1 = require("../modules");
const logwriter_1 = require("../modules/system/logwriter");
const saver_1 = require("../modules/system/saver");
const auth = require("./../../ress/auth.json");
var client;
//------ Parent Process Start ------//
if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', function (deadWorker, code, signal) {
        saver_1.DataSaver.saveJson("tricks.json", global.tricks);
        saver_1.DataSaver.saveJson("glyphpages.json", global.glyphpages);
        setTimeout(() => {
            // Restart the worker
            cluster.fork();
        }, 5000); // time for saving data
    });
    //-------- Parent Process End -------//
}
else if (cluster.isWorker) {
    client = new Discord.Client();
    client.login(auth.token);
    // 
    client.on("ready", () => {
        console.log("Initiate Message Listener");
        if (!("commands" in global)) {
            global.commands = require("./../modules/zerk").commands;
        }
        global.msgListener = new handler_1.MessageListener(client);
        //load commands
        modules_1.onStart(client);
        require("./../api/api.js");
    });
    if (!("client" in global)) {
        global.client = client;
    }
    client.on("guildCreate", (guild) => {
        logwriter_1.Logwriter.writeLog("Join", "Invited to " + guild.name + " Owner: " + guild.owner.user.username, guild.owner.user.username, false);
    });
}
