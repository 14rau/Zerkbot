"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const logwriter_1 = require("../system/logwriter");
const saver_1 = require("../system/saver");
class TrickProvider {
    /**
     *
     * @param type This is "awakening" or "nonawakening"
     * @param position This is the position from the trick you want
     */
    static getTricks(isAdmin, type) {
        let returnOverSize = [];
        if ((type && (type === "awakening") || (type == "nonawakening"))) {
            let returnStructure = {
                title: "Tricks for " + type.toUpperCase(),
                fields: [],
                color: 16729156,
            };
            if (global.tricks[type].length > 25) {
                let tempTricks = _.clone(global.tricks[type]);
                let indexer = 0;
                while (tempTricks.length >= 25) {
                    let ret = tempTricks.splice(0, 24).map((el) => {
                        indexer++;
                        return {
                            name: (global.client.users.get(el.by) ?
                                global.client.users.get(el.by).username
                                : Number.isNaN(Number.parseInt(el.by)) ?
                                    el.by : el.by + "(User is not known on any known server)") + isAdmin ? indexer - 1 : "",
                            value: el.trick,
                            inline: true,
                        };
                    });
                    returnOverSize.push({
                        title: "Tricks for " + type.toUpperCase() + "(" + (returnOverSize.length + 1) + ")",
                        fields: ret,
                        color: 16729156,
                    });
                }
                return returnOverSize;
            }
            else {
                returnStructure.fields = global.tricks[type].map((el, ind) => {
                    let name = ((global.client.users.get(el.by) ?
                        global.client.users.get(el.by).username
                        : Number.isNaN(Number.parseInt(el.by)) ?
                            el.by : el.by + "(User is not known on any known server)"));
                    if (isAdmin) {
                        name += +" (" + ind + ")";
                    }
                    return {
                        name: name,
                        value: el.trick,
                        embed: null,
                        inline: true,
                    };
                });
                return returnStructure;
            }
        }
        else {
            return "Wich kind of tricks do you want? nonawakening or awakening?";
        }
    }
    /**
     *
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    static addTrick(type, commitBy, trick) {
        global.tricks[type].push({
            trick: trick,
            by: commitBy,
            approved: {
                isApproved: true,
                approvedBy: "ADMINISTRATOR"
            }
        });
        logwriter_1.Logwriter.writeLog("addTrick", "Trick was added and approved by an Administrator", "ADMINISTRATOR", false);
        saver_1.DataSaver.saveJson("tricks.json", global.tricks);
    }
    /**
     *
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    static rmTrick(type, commitBy, index) {
        try {
            global.tricks[type].splice(Number.parseInt(index), 1);
            logwriter_1.Logwriter.writeLog("rmTrick", "Deleted trick with index " + index, commitBy, false);
            saver_1.DataSaver.saveJson("tricks.json", global.tricks);
        }
        catch (err) {
            logwriter_1.Logwriter.writeLog("rmTrick", "Tried to delete trick with index " + index + " but failed!", commitBy, false);
            console.log(err);
        }
    }
}
exports.TrickProvider = TrickProvider;
