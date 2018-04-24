"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tricks_1 = require("./Tricks");
const util_1 = require("util");
const Rotation_1 = require("./Rotation");
const Glyphs_1 = require("./Glyphs");
/*
    Conversation State
*/
let addrotationDialog = [];
//util functions for dialog
function containsConversation(id) {
    for (let conv of addrotationDialog) {
        if (conv.id === id) {
            return true;
        }
    }
    return false;
}
function conversationAt(id) {
    for (let i = 0; i <= addrotationDialog.length; i++) {
        if (addrotationDialog[i].id === id) {
            return i;
        }
    }
    return -1;
}
function newConversation(id) {
    addrotationDialog.push({
        id: id,
        createdAt: new Date().getTime(),
        editedAt: new Date().getTime(),
        state: 0
    });
    setTimeout(() => {
        try {
            deleteConversation(id);
        }
        catch (err) {
            console.log(err);
        }
    }, 60000 * 30); //30min -> clean
}
function editConversation(id, type, value) {
    let position = conversationAt(id);
    if (!addrotationDialog[position].conversation) {
        addrotationDialog[position].conversation = {};
    }
    if (type === "state") {
        addrotationDialog[position].state = value;
    }
    else {
        if (type !== "rotation") {
            addrotationDialog[position].conversation[type] = value;
        }
        else {
            addrotationDialog[position].conversation[type] = value;
        }
    }
}
function deleteConversation(id) {
    addrotationDialog.splice(conversationAt(id), 1);
}
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
    }, {
        name: "addrotation",
        description: "Adds new rotation. Bot will tell you how to use it!",
        showCmd: false,
        function: (args, message) => {
            if (isAdmin(message.author.id)) {
                if (containsConversation(message.author.id)) {
                    switch (addrotationDialog[conversationAt(message.author.id)].state) {
                        case 1:
                            editConversation(message.author.id, "name", args.join(" "));
                            message.channel.send("Good, who commited this rotation? Use `" + global.settings.command + "addrotation Username or DiscordID`");
                            editConversation(message.author.id, "state", 2);
                            break;
                        case 2:
                            editConversation(message.author.id, "commitedBy", args.join(" "));
                            message.channel.send("Great. Lets get to the fun part! Use `" + global.settings.command + "addrotation Skillname > Skillname > Skillname(stuff) ...`");
                            editConversation(message.author.id, "state", 3);
                            break;
                        case 3:
                            editConversation(message.author.id, "rotation", args.join(" ").split(">"));
                            message.channel.send("Nearly finished. Now set the description of your rotation! Use `" + global.settings.command + "addrotation Your rotation description`");
                            editConversation(message.author.id, "state", 4);
                            break;
                        case 4:
                            editConversation(message.author.id, "description", args.join(" "));
                            message.channel.send("And now. Are you sure, that you want to save this rotation? Use `" + global.settings.command + "addrotation save or cancel`");
                            editConversation(message.author.id, "state", 5);
                            break;
                        case 5:
                            if (args[0] === "save") {
                                let conv = addrotationDialog[conversationAt(message.author.id)];
                                Rotation_1.RotationProvider.addRotation({
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
                                });
                                message.channel.send("You added a new Zerktastic rotation!");
                                deleteConversation(message.author.id);
                            }
                            else {
                                message.channel.send("You reverted your changes! Seems like this rotation is not that zerktastic");
                                deleteConversation(message.author.id);
                            }
                            break;
                    }
                }
                else {
                    newConversation(message.author.id);
                    message.channel.send("Hello. Please type the name of your rotation. Type it like this: `" + global.settings.command + "addrotation Your Rotation Name`");
                    editConversation(message.author.id, "state", 1);
                }
            }
            else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!");
            }
        }
    }, {
        name: "rotation",
        description: "Displays an rotation\nSyntax: " + global.settings.command + "rotation index",
        showCmd: false,
        function: (args, message) => {
            message.channel.send(Rotation_1.RotationProvider.getRotation(true, args[0]));
        }
    }, {
        name: "rmrotation",
        description: "Remove an rotation\nSyntax: " + global.settings.command + "rmrotation index",
        showCmd: false,
        function: (args, message) => {
            if (isAdmin(message.author.id)) {
                Rotation_1.RotationProvider.rmRotation(message.author.id, args[0]);
            }
            else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!");
            }
        }
    }, {
        name: "addglyph",
        description: "Add an Glyphpage\nSyntax: " + global.settings.command + "addglyphpage createdBy(Without space) Pagename\n You will also have to add the screenshot as an **attachment**",
        showCmd: false,
        function: (args, message) => {
            if (isAdmin(message.author.id)) {
                Glyphs_1.GlyphProvider.addBuild(message.attachments.first().url, args[0], args.splice(1, args.length - 1).join(" "));
            }
            else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!");
            }
        }
    }, {
        name: "glyphs",
        description: "Returns an Glyphpage\nSyntax: " + global.settings.command + "glyphs index",
        showCmd: false,
        function: (args, message) => {
            message.channel.send(Glyphs_1.GlyphProvider.getBuild(true, args[0]));
        }
    }, {
        name: "rmglyph",
        description: "Remove an glyphbuild\nSyntax: " + global.settings.command + "rmglyph index",
        showCmd: false,
        function: (args, message) => {
            if (isAdmin(message.author.id)) {
                Glyphs_1.GlyphProvider.rmGlyph(message.author.id, args[0]);
            }
            else {
                message.channel.send("Administrator needed. To get administrator rights you need to contact the Bothoster!");
            }
        }
    }];
//util functions
function isAdmin(uid) {
    try {
        return global.client.guilds.get(global.settings.mainGuild).members.get(uid).highestRole.name === global.settings.editorRole;
    }
    catch (err) {
        console.log(err);
        return global.settings.Administrator.indexOf(uid) !== -1;
    }
}
exports.isAdmin = isAdmin;
exports.commands = commands;
