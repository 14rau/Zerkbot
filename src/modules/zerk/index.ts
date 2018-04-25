import { IBotCommand } from "../../interfaces";
import { Message, Client } from "discord.js";
import { TrickProvider } from "./Tricks";
import { isArray } from "util";
import { RotationProvider } from "./Rotation";
import { GlyphProvider } from "./Glyphs";

/*
    Conversation State
*/
let addrotationDialog : IRotationDialog[] = [];

interface IRotationDialog{
    id: string,
    state: number,
    createdAt: number,
    editedAt: number,
    conversation?: {
        commitedBy?: string;
        name?: string;
        description?: string;
        rotation?: string[];
    }
}

//util functions for dialog
function containsConversation(id : string) : boolean {
    for(let conv of addrotationDialog) {
        if(conv.id === id) {
            return true;
        }
    }
    return false;
}

function conversationAt(id : string) {
    for(let i = 0; i <= addrotationDialog.length; i++) {
        if(addrotationDialog[i].id === id) {
            return i;
        }
    }
    return -1;
}

function newConversation(id : string) {
    addrotationDialog.push({
        id: id,
        createdAt: new Date().getTime(),
        editedAt: new Date().getTime(),
        state: 0
    })

    setTimeout(() => {
        try{
            deleteConversation(id)
        } catch(err) {
            console.log(err)
        }
    }, 60000 * 30) //30min -> clean
}

function editConversation(id : string, type : "state" | "commitedBy" | "name" | "description" | "rotation", value : string | number | string[]) {
    let position = conversationAt(id);
    if(!addrotationDialog[position].conversation) {
        addrotationDialog[position].conversation = {};
    }
    if(type === "state") {
        addrotationDialog[position].state = value as number;
    } else {
        if(type !== "rotation") {
            addrotationDialog[position].conversation[type] = value as string;
        } else {
            addrotationDialog[position].conversation[type] = value as string[];
        }
    }
}

function deleteConversation(id : string) {
    addrotationDialog.splice(conversationAt(id) ,1);
}

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
                if(args.length > 0) {
                    TrickProvider.rmTrick(args[0] as any, message.author.id ,args[1]);
                }
            } else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!")
            }
        }
    },{
        name: "addrotation",
        description: "Adds new rotation. Bot will tell you how to use it!",
        showCmd: false,
        function: (args: string[], message : Message) => {
            if(isAdmin(message.author.id)) {
                if(containsConversation(message.author.id)){
                    switch(addrotationDialog[conversationAt(message.author.id)].state) {
                        case 1:
                            if(args.length > 0) {
                                editConversation(message.author.id, "name", args.join(" "));
                                message.channel.send("Good, who commited this rotation? Use `"+global.settings.command+"addrotation Username or DiscordID`");
                                editConversation(message.author.id, "state", 2)
                            } else {
                                message.channel.send("No arguments given!")
                            }
                            break;
                        case 2:
                            if(args.length > 0) {
                                editConversation(message.author.id, "commitedBy", args.join(" "));
                                message.channel.send("Great. Lets get to the fun part! Use `"+global.settings.command+"addrotation Skillname > Skillname > Skillname(stuff) ...`");
                                editConversation(message.author.id, "state", 3)
                            } else {
                                message.channel.send("No arguments where given!")
                            }
                            break;
                        case 3:
                            if(args.length > 0) {
                                editConversation(message.author.id, "rotation", args.join(" ").split(">"));
                                message.channel.send("Nearly finished. Now set the description of your rotation! Use `"+global.settings.command+"addrotation Your rotation description`");
                                editConversation(message.author.id, "state", 4)

                            } else {
                                message.channel.send("No arguments where given!")
                            }
                            break;
                        case 4:
                            if(args.length > 0) {
                                editConversation(message.author.id, "description", args.join(" "));
                                message.channel.send("And now. Are you sure, that you want to save this rotation? Use `"+global.settings.command+"addrotation save or cancel`");
                                editConversation(message.author.id, "state", 5)

                            } else {
                                message.channel.send("No arguments where given!")
                            }
                            break;
                        case 5:
                            if(args[0] === "save") {
                                let conv = addrotationDialog[conversationAt(message.author.id)];
                                RotationProvider.addRotation({
                                    approved: {
                                        isApproved: true,
                                        approvedBy: message.author.id
                                    },
                                    commitedBy: conv.conversation.commitedBy,
                                    rotation: {
                                        rotation: conv.conversation.rotation,
                                        name: conv.conversation.name,
                                        description: conv.conversation.description
                                    }
                                })
                                message.channel.send("You added a new Zerktastic rotation!");
                                deleteConversation(message.author.id);
                            } else {
                                message.channel.send("You reverted your changes! Seems like this rotation is not that zerktastic");
                                deleteConversation(message.author.id);
                            }
                            break;
                    }
                } else {
                    newConversation(message.author.id);
                    message.channel.send("Hello. Please type the name of your rotation. Type it like this: `"+global.settings.command+"addrotation Your Rotation Name`")
                    editConversation(message.author.id, "state", 1)
                }


            } else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!")
            }
        }
    },{
        name: "rotation",
        description: "Displays an rotation\nSyntax: " + global.settings.command + "rotation index",
        showCmd: false,
        function: (args: string[], message : Message) => {
            message.channel.send(RotationProvider.getRotation(true, args[0]))
        }
    },{
        name: "rmrotation",
        description: "Remove an rotation\nSyntax: " + global.settings.command + "rmrotation index",
        showCmd: false,
        function: (args: string[], message : Message) => {
            if(isAdmin(message.author.id)) {
                RotationProvider.rmRotation(message.author.id, args[0]);
            } else {
                if(args.length) message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!")
                else message.channel.send("No arguments where given!")
            }
        }
    },{
        name: "addglyph",
        description: "Add an Glyphpage\nSyntax: " + global.settings.command + "addglyphpage createdBy(Without space) Pagename\n You will also have to add the screenshot as an **attachment**",
        showCmd: false,
        function: (args: string[], message : Message) => {
            if(isAdmin(message.author.id)) {
                console.log(args)
                if(args.length === 0) {
                    message.channel.send("No arguments where given!");
                } else {
                    try{
                        GlyphProvider.addBuild(message.attachments.first().url ,args[0],args.splice(1,args.length - 1).join(" "));
                    } catch(err) {
                        message.channel.send("Error\n```js\n"+ err.message +" ```")
                    }
                }
            } else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!")
            }
        }
    },{
        name: "glyphs",
        description: "Returns an Glyphpage\nSyntax: " + global.settings.command + "glyphs index",
        showCmd: false,
        function: (args: string[], message : Message) => {
            message.channel.send(GlyphProvider.getBuild(true, args[0]));
        }
    },{
        name: "rmglyph",
        description: "Remove an glyphbuild\nSyntax: " + global.settings.command + "rmglyph index",
        showCmd: false,
        function: (args: string[], message : Message) => {
            if(isAdmin(message.author.id)) {
                GlyphProvider.rmGlyph(message.author.id, args[0]);
            } else {
                if(args.length > 0) message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!");
                else message.channel.send("No arguments where given!");
            }
        }
    }]
    
    
//util functions

export function isAdmin(uid : string) : boolean {
    try {
        return (global.client as Client).guilds.get(global.settings.mainGuild).members.get(uid).highestRole.name === global.settings.editorRole;
    } catch (err) {
        console.log(err);
        return global.settings.Administrator.indexOf(uid) !== -1;
    }
}
exports.commands = commands;