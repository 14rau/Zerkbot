"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class DataSaver {
    /**
     * Speicherfunktion
     * @param {*} path // will be saved in DATA. So if you just want to save the file in DATA, you only need to type "filename.json"
     * @param {*} data
     */
    static saveJson(path, data) {
        console.log("Saving " + path + "...");
        if (fs.existsSync("./DATA/" + path)) {
            fs.writeFile("./DATA/" + path, JSON.stringify(data), (err) => {
                if (err)
                    console.error(err);
                console.log("Saved " + path + "...");
            });
        }
        else {
            fs.unlink("./DATA/" + path, (err) => {
                if (err)
                    console.error(err);
                fs.writeFile("./DATA/" + path, JSON.stringify(data), (err) => {
                    if (err)
                        console.error(err);
                });
                console.log("Saved " + path + "...");
            });
        }
    }
}
exports.DataSaver = DataSaver;
