import * as Discord from "discord.js";
import { IMessageListener, IBotCommand } from "../interfaces";
import { CommandBuilder } from "./CommandCreator";
import * as Modules from "./../modules";

//this to be called by Discord bot

export class MessageListener{
    private listener: IMessageListener[] = [];
    private commandBuilder = new CommandBuilder();
    private commands : IBotCommand[] = [];
    public readyToPair : string[] = [];

    constructor(bot : Discord.Client) {
        this.initateCommands();

        bot.on("message", (message) => {
            if (message.content.substring(0, 2) == global.settings.command) {
                let args = message.content.split(global.settings.command).join("").split(" ");
                if(message.channel.type !== "dm"){
                    this.onCommand(args, message, args[0]);
                }
            } else {
                if(this.isListening(message.author.id, message.channel.id)) {
                    let listener = this.getListener(message.author.id);
                    if(listener.validtill <= new Date().getTime()) {
                        listener.onChange(message.content);
                    } else {
                        this.removeMessageListener(message.author.id);
                    }
                }
            }
        })
    }


    public onListenessage(message: Discord.Message) : string {
        return "ER"
    }

    public onCommand(args : string[], message: Discord.Message, cmd : string) {
        args.splice(0,1); // remove command from arguments
        if(cmd === "commands") {
            message.channel.send(Modules.returnCommandList(message.author.id));
        } else {
            let command = this.resolveCommand(cmd)
            return command ? command.function(args, message) : message.channel.send("I don't know this command")
        }
    }

    private isListening(id : string, channelid : string) : boolean {
        for(let i of this.listener) {
            if(i.userid === id && i.channelid === channelid) {
                return true;
            }
        }
        return false;
    }

    private getListener(id : string) : IMessageListener {
        for(let i of this.listener) {
            if(i.userid === id) {
                return i;
            }
        }
        return;
    }

    public addMessageListener(listener : IMessageListener) {
        this.listener.push(listener);
    }

    /**
     * This will remove an message listener (searched by id)
     * 
     * @param uid 
     */
    public removeMessageListener(uid : string) : boolean {
        for(let i = 0; i <= this.listener.length -1; i++) {
            if(this.listener[i].userid === uid) {
                this.listener.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public resolveCommand(cmd : string) : IBotCommand {
        for(let i of Modules.commands) {
            if(i.name === cmd) {
                return i;
            }
        }   
    }

    private initateCommands() : void {
        this.commands.push(
            this.commandBuilder.createCommand({name: "ping", function: (args : string[]) => {                
                return "pong";
            }})
        );
    }
}