
//get discord types
import { MessageEmbed } from "discord.js";
import { IGlyphbuild } from "../../interfaces";
import { Logwriter } from "../system/logwriter";
import { DataSaver } from "../system/saver";



export class GlyphProvider {
    /**
     * 
     * @param type This is "awakening" or "nonawakening"
     * @param position This is the position from the trick you want
     */
    public static getBuild(isAdmin : boolean, build? : string){
       if(build && (Number.parseInt(build) >= 0) && (Number.parseInt(build) < global.glyphpages.length)) {
            return {
                embed: {
                    description: (global.glyphpages as IGlyphbuild[])[Number.parseInt(build)].description,
                    image: {
                        url: (global.glyphpages as IGlyphbuild[])[Number.parseInt(build)].url,
                    }
                }
            }
       } else {
           return (global.glyphpages as IGlyphbuild[]).map((el,ind) => {
                return el.description + " ("+ind+")"
           }).join("\n")
       }
    }

    /**
     * 
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    public static addBuild(url : string, commitBy : string, description : string) {
        global.glyphpages.push({
            url: url,
            description: description,
            commitedBy: commitBy,
            approved: {
                isApproved: true,
                approvedBy: "ADMINISTRATOR"
            }
        });
        Logwriter.writeLog("addBuild", "Build was added and approved by an Administrator", "ADMINISTRATOR", false);
        DataSaver.saveJson("glyphpages.json", global.glyphpages);
    }

    /**
     * 
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    public static rmGlyph(commitBy : string, index : string) {
        try {
            global.glyphpages.splice(Number.parseInt(index), 1);
            Logwriter.writeLog("rmGlyph", "Deleted glyphbuild with index " + index, commitBy, false);
            DataSaver.saveJson("glyphpages.json", global.glyphpages);
        } catch (err) {
            Logwriter.writeLog("rmGlyph", "Tried to delete glyphbuild with index " + index + " but failed!", commitBy, false);
            console.log(err);
        }
    }
}