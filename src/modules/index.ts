import { IBotCommand } from "../interfaces";
import * as Discord from "discord.js";
import { isAdmin } from "./zerk";
export var commands : IBotCommand[] = [];

export function onStart(client : Discord.Client){
    //add some util functions like invite link and info
    global.commands.push( {
        name: "invite",
        description: "Get the bots intivelink",
        showCmd: true,
        function: (args: string[], message : Discord.Message) => {
            message.channel.send({
                embed: {
                    title: "Ultimate Zerkbot",
                    description: "Get the super awesome Zerkbot now on your server with this super awesome invitelink:\n" + global.settings.invite,
                    footer: {
                        text: "Made and hosted by: Rëiyn, Yurian"
                    }
                }
            })
        }
    });
    global.commands.forEach((el : any) => {
        commands.push(el);
    });
}

export function returnCommandList(id : string) {
    let fields : any[] = [];
    commands.forEach((el) => {
        if(el.showCmd || isAdmin(id)) {
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
        
    }
    return ret;
}
