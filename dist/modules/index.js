"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zerk_1 = require("./zerk");
exports.commands = [];
function onStart(client) {
    //add some util functions like invite link and info
    global.commands.push({
        name: "invite",
        description: "Gets the bot's intivelink",
        showCmd: true,
        function: (args, message) => {
            message.channel.send({
                embed: {
                    title: "Ultimate Zerkbot",
                    description: "Get the super awesome Zerkbot now on your server with this super awesome invitelink:\n" + global.settings.invite,
                    footer: {
                        text: "Made and hosted by: Rëiyn, Yurian"
                    }
                }
            });
        }
    });
    global.commands.forEach((el) => {
        exports.commands.push(el);
    });
}
exports.onStart = onStart;
function returnCommandList(id) {
    let fields = [];
    exports.commands.forEach((el) => {
        if (el.showCmd || zerk_1.isAdmin(id)) {
            fields.push({
                name: global.settings.command + el.name,
                value: el.description
            });
        }
    });
    let ret = {
        embed: {
            title: "Commandlist",
            description: "Commandliste",
            fields: fields
        }
    };
    return ret;
}
exports.returnCommandList = returnCommandList;
