var fs = require('fs');
const mkdirSync = function (dirPath, cb) {
    try {
        fs.mkdirSync(dirPath);
        cb();
    }
    catch (err) {
        if (err.code !== 'EEXIST')
            console.log(dirPath + "exists!");
        cb();
    }
};
mkdirSync("./ress", () => {
    try {
        let data = require("./../ress/auth.json");
        console.log("./../ress/auth.json exists!");
    }
    catch (err) {
        try {
            fs.writeFileSync('./ress/auth.json', `{
                "token": "DISCORDBOTTOKEN",
            }`);
        }
        catch (err) {
            console.log("Cannot write file", err);
        }
    }
    try {
        let data = require("./../ress/settings.json");
        console.log("./../ress/settings.json exists!");
    }
    catch (err) {
        try {
            fs.writeFileSync('./ress/auth.json', `{
                "Administrator: [YOUR DISCORDID]",
                "log": "CHANNEL THAT IS BEEING USED FOR LOGGING!",
                "command" : "z!",
                "invite" : "https://discordapp.com/api/oauth2/authorize?client_id=437954875595161621&permissions=0&scope=bot"
            }`);
            console.log("Some more informations:");
            console.log("Administrators have full rights. The changes they commit, will be added instantly. Only Administrators can delete informations");
            console.log("log will need an channelid for loging.");
            console.log("mainserver: Since this bot can be used on different servers, you need to set the main server for different ressources (creating invites etc)");
            console.log("You have to set settings by yourself in: ress/settings.json. Dont forget to set your Bottoken!");
        }
        catch (err) {
            console.log("Cannot write file", err);
        }
    }
});
mkdirSync("./logger", () => {
    try {
        let data = require("./../logger/errorlog.txt");
        console.log(".errorlog.txt exists!");
    }
    catch (err) {
        try {
            fs.writeFileSync('./logger/errorlog.txt', "ERRORLOG\n");
        }
        catch (err) {
            console.log("Cannot write file", err);
        }
    }
    console.log("the errorlog.txt contains the informations in case the bot suddenly dies. The Bot will restart and log every error that coused that crash. This information needs to be send to the dev!");
});
