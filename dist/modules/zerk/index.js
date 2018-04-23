"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tricks_1 = require("./Tricks");
const util_1 = require("util");
var commands = [{
        name: "tricks",
        description: "Display nonawakening and awakening tricks for zerk",
        showCmd: true,
        function: (args, message) => {
            let response = Tricks_1.TrickProvider.getTricks(isAdmin(message.author.id), args[0]);
            if (util_1.isArray(response)) {
                response.forEach((el) => {
                    message.channel.send({ embed: el });
                });
            }
            else if (typeof response === "string") {
                message.channel.send(response);
            }
            else {
                message.channel.send({ embed: response });
            }
        }
    }, {
        name: "addtrick",
        description: "Addstrick admin only\nSyntax:\n" + global.settings.command + "addtrick awakening userthencommitedthetrick the trick",
        showCmd: false,
        function: (args, message) => {
            if ((args[0] === "awakening" || args[0] === "nonawakening") && isAdmin(message.author.id)) {
                Tricks_1.TrickProvider.addTrick(args[0], args[1], args.splice(2, args.length - 1).join(" "));
            }
        }
    }, {
        name: "rmtrick",
        description: "removed an trick\nSyntax: " + global.settings.command + "rmtrick type index",
        showCmd: false,
        function: (args, message) => {
            if (isAdmin(message.author.id)) {
                Tricks_1.TrickProvider.rmTrick(args[0], message.author.id, args[1]);
            }
            else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!");
            }
        }
    },];
//util functions
function isAdmin(uid) {
    return global.settings.Administrator.indexOf(uid) !== -1;
}
exports.isAdmin = isAdmin;
exports.commands = commands;
