import { IBotCommand } from "../../interfaces";
import { Message } from "discord.js";
import { TrickProvider } from "./Tricks";
import { isArray } from "util";



var commands : IBotCommand[]= [{
    name: "tricks",
    description: "Display nonawakening and awakening tricks for zerk",
    showCmd: true,
    function: (args : ["awakening" | "nonawakening"], message : Message) => {
        let response = TrickProvider.getTricks(isAdmin(message.author.id) ,args[0]);
        if(isArray(response)) {
            response.forEach((el) => {
                message.channel.send({embed: el});
            })
        } else if(typeof response === "string") {
            message.channel.send(response);
        } else {
            message.channel.send({embed: response});
        }
    }
},{
    name: "addtrick",
    description: "Addstrick admin only\nSyntax:\n"+global.settings.command+"addtrick awakening userthencommitedthetrick the trick",
    showCmd: false,
    function: (args : string[], message : Message) => {
        if((args[0] === "awakening" || args[0] === "nonawakening") && isAdmin(message.author.id)) {
            TrickProvider.addTrick((args[0] as "awakening" | "nonawakening"), args[1] ,args.splice(2, args.length-1).join(" "));
        }
    }
},{
    name: "rmtrick",
    description: "removed an trick\nSyntax: " + global.settings.command + "rmtrick type index",
    showCmd: false,
    function: (args: string[], message : Message) => {
        if(isAdmin(message.author.id)) {
            TrickProvider.rmTrick(args[0] as any, message.author.id ,args[1]);
        } else {
            message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!")
        }
    }
},]


//util functions

export function isAdmin(uid : string) : boolean{
    return global.settings.Administrator.indexOf(uid) !== -1;
}
exports.commands = commands;