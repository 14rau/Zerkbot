global.tricks = require("./../../DATA/tricks.json");
global.glyphpages = require("./../../DATA/glyphpages.json");
if(!("settings" in global)) {
    global.settings = require("./../../ress/settings.json");
}

import * as cluster from "cluster";
import * as Discord from "discord.js";
import { MessageListener } from "../handler";
import { onStart } from "../modules";
import { Logwriter } from "../modules/system/logwriter";
import { DataSaver } from "../modules/system/saver";
const auth =  require("./../../ress/auth.json");
var client : Discord.Client;

//------ Parent Process Start ------//
if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', function(deadWorker, code, signal) {
        DataSaver.saveJson("tricks.json", global.tricks);
        DataSaver.saveJson("glyphpages.json", global.glyphpages);
        setTimeout(()=>{
            // Restart the worker
            cluster.fork();
        },5000); // time for saving data
    });
    //-------- Parent Process End -------//
} else if (cluster.isWorker) {
    client = new Discord.Client();
    client.login(auth.token);
    // 
    client.on("ready", () => {
        console.log("Initiate Message Listener");
        if(!("commands" in global)) {
            global.commands = require("./../modules/zerk").commands;
        }
        global.msgListener = new MessageListener(client);
        //load commands
        onStart(client);
        require("./../api/api.js");
    });
    if(!("client" in global)) {
        global.client = client;
    }

    client.on("guildCreate", (guild) => {
        Logwriter.writeLog("Join", "Invited to " + guild.name + " Owner: " + guild.owner.user.username, guild.owner.user.username, false);
    })
}







