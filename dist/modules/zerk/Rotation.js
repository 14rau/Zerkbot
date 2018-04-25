"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//get discord types
const logwriter_1 = require("../system/logwriter");
const saver_1 = require("../system/saver");
class RotationProvider {
    /**
     *
     * @param type This is "awakening" or "nonawakening"
     * @param position This is the position from the trick you want
     */
    static getRotation(isAdmin, rotation) {
        if (rotation && (Number.parseInt(rotation) >= 0) && (Number.parseInt(rotation) < global.rotations.length)) {
            let rota = global.rotations[Number.parseInt(rotation)];
            return {
                embed: {
                    description: rota.rotation.description,
                    title: rota.rotation.name,
                    fields: [{
                            name: "Rotation",
                            inline: false,
                            value: rota.rotation.rotation.join(" > ")
                        }],
                    footer: {
                        text: "This rotation has been commited by " + rota.commitedBy,
                    }
                }
            };
        }
        else {
            let indexer = 0;
            let ret = [];
            while (global.rotations.length >= 25) {
                let tempString = "";
                global.rotations.splice(0, 25).forEach((el) => {
                    tempString += el.rotation.name + " (" + indexer + ")\n";
                    indexer++;
                });
                ret.push(tempString);
                if (global.rotations.length === 0)
                    return ret;
            }
            let tempString = "";
            global.rotations.forEach((el, index) => {
                tempString += el.rotation.name + " (" + index + ")\n";
            });
            return tempString;
        }
    }
    /**
     *
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    static addRotation(rotation) {
        global.rotations.push(rotation);
        logwriter_1.Logwriter.writeLog("addRotation", "Rotation was added and approved by an Administrator", "ADMINISTRATOR", false);
        saver_1.DataSaver.saveJson("rotation.json", global.rotations);
    }
    /**
     *
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    static rmRotation(commitBy, index) {
        global.rotations.splice(Number.parseInt(index), 1);
        logwriter_1.Logwriter.writeLog("rmRotation", "Rotation was removed by an Administrator", "ADMINISTRATOR", false);
        saver_1.DataSaver.saveJson("rotation.json", global.rotations);
    }
    static editRotation(index, rotation) {
        global.rotations[Number.parseInt(index)] = rotation;
        logwriter_1.Logwriter.writeLog("editRotation", "Rotation was edited and approved by an Administrator", "ADMINISTRATOR", false);
        saver_1.DataSaver.saveJson("rotation.json", global.rotations);
    }
}
exports.RotationProvider = RotationProvider;
