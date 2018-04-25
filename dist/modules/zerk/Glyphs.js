"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logwriter_1 = require("../system/logwriter");
const saver_1 = require("../system/saver");
class GlyphProvider {
    /**
     *
     * @param type This is "awakening" or "nonawakening"
     * @param position This is the position from the trick you want
     */
    static getBuild(isAdmin, build) {
        if (build && (Number.parseInt(build) >= 0) && (Number.parseInt(build) < global.glyphpages.length)) {
            return {
                embed: {
                    description: global.glyphpages[Number.parseInt(build)].description,
                    image: {
                        url: global.glyphpages[Number.parseInt(build)].url,
                    }
                }
            };
        }
        else {
            return global.glyphpages.map((el, ind) => {
                return el.description + " (" + ind + ")";
            }).join("\n");
        }
    }
    /**
     *
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    static addBuild(url, commitBy, description) {
        global.glyphpages.push({
            url: url,
            description: description,
            commitedBy: commitBy,
            approved: {
                isApproved: true,
                approvedBy: "ADMINISTRATOR"
            }
        });
        logwriter_1.Logwriter.writeLog("addBuild", "Build was added and approved by an Administrator", "ADMINISTRATOR", false);
        saver_1.DataSaver.saveJson("glyphpages.json", global.glyphpages);
    }
    /**
     *
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    static rmGlyph(commitBy, index) {
        try {
            global.glyphpages.splice(Number.parseInt(index), 1);
            logwriter_1.Logwriter.writeLog("rmGlyph", "Deleted glyphbuild with index " + index, commitBy, false);
            saver_1.DataSaver.saveJson("glyphpages.json", global.glyphpages);
        }
        catch (err) {
            logwriter_1.Logwriter.writeLog("rmGlyph", "Tried to delete glyphbuild with index " + index + " but failed!", commitBy, false);
            console.log(err);
        }
    }
}
exports.GlyphProvider = GlyphProvider;
