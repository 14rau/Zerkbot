"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandCreator_1 = require("./CommandCreator");
const Modules = require("./../modules");
//this to be called by Discord bot
class MessageListener {
    constructor(bot) {
        this.listener = [];
        this.commandBuilder = new CommandCreator_1.CommandBuilder();
        this.commands = [];
        this.readyToPair = [];
        this.initateCommands();
        bot.on("message", (message) => {
            if (message.content.substring(0, 2) == global.settings.command) {
                let args = message.content.split(global.settings.command).join("").split(" ");
                if (message.channel.type !== "dm") {
                    this.onCommand(args, message, args[0]);
                }
            }
            else {
                if (this.isListening(message.author.id, message.channel.id)) {
                    let listener = this.getListener(message.author.id);
                    if (listener.validtill <= new Date().getTime()) {
                        listener.onChange(message.content);
                    }
                    else {
                        this.removeMessageListener(message.author.id);
                    }
                }
            }
        });
    }
    onListenessage(message) {
        return "ER";
    }
    onCommand(args, message, cmd) {
        args.splice(0, 1); // remove command from arguments
        if (cmd === "commands") {
            message.channel.send(Modules.returnCommandList(message.author.id));
        }
        else {
            let command = this.resolveCommand(cmd);
            return command ? command.function(args, message) : message.channel.send("I don't know this command");
        }
    }
    isListening(id, channelid) {
        for (let i of this.listener) {
            if (i.userid === id && i.channelid === channelid) {
                return true;
            }
        }
        return false;
    }
    getListener(id) {
        for (let i of this.listener) {
            if (i.userid === id) {
                return i;
            }
        }
        return;
    }
    addMessageListener(listener) {
        this.listener.push(listener);
    }
    /**
     * This will remove an message listener (searched by id)
     *
     * @param uid
     */
    removeMessageListener(uid) {
        for (let i = 0; i <= this.listener.length - 1; i++) {
            if (this.listener[i].userid === uid) {
                this.listener.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    resolveCommand(cmd) {
        for (let i of Modules.commands) {
            if (i.name === cmd) {
                return i;
            }
        }
    }
    initateCommands() {
        this.commands.push(this.commandBuilder.createCommand({ name: "ping", function: (args) => {
                return "pong";
            } }));
    }
}
exports.MessageListener = MessageListener;
