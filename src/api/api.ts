/*                          */
//    Zerkbot API    //
/*                          */
import * as Discord from "discord.js";
var v1 = require("./api/v1/api").v1;

var express = require("express"),
    app = express()
    var port = global.settings.apiPort;
app.enable('trust proxy') 

app.listen(port);
console.log("Zerkbot API is now online! ")
let settings = require("./../../ress/settings.json");
let admins : string[] = [];
settings.Administrator.forEach((el : string) => {
    let user = (global.client as Discord.Client).users.get(el)
    admins.push(user.username + "#" + user.discriminator)
})

app.get("/", (req: any, res: any) => {
    res.send({
        "ZERKBOT_VERSION" : require("./../../package.json").version,
        "ADMINISTRATORS" : admins,
        "LEADING_DEV" : "Rëiyn#0010",
        "SERVER_TIME" : new Date().toISOString(),
        "apiVersion" : "/v1/",
        "description" : "What is Zerkbot? Zerkbot is a Bot created for connecting zerkplayers together and sharing their knowledge. If you want to get involved directly, just join the Zerk-Discord: https://discord.gg/PuFdCdJ"
    });
});

//app.use("/pokemon", pokemon_api);
//app.use("/map", map_api);
//app.use("/item", item_api);
app.use("/v1", v1);

app.use(function(req : any, res : any, next : any) {
    console.log(req.connection.remoteAddress + " requested 404")
    console.log('http://' + req.get('host') + req.originalUrl)
    res.status(404).send('Sorry cant find that!');
});
/*
API RIGHTS
0 -> Profile
1 -> All above, Daily
> 2 -> Everything
*/