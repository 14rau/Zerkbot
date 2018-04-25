
//get discord types
import { MessageEmbed, Client } from "discord.js";
import { ITricks } from "../../interfaces";
import * as _ from "lodash";
import { Logwriter } from "../system/logwriter";
import { DataSaver } from "../system/saver";



export class TrickProvider {
    /**
     * 
     * @param type This is "awakening" or "nonawakening"
     * @param position This is the position from the trick you want
     */
    public static getTricks(isAdmin : boolean, type? : "awakening" | "nonawakening") : Partial<MessageEmbed> | Partial<MessageEmbed>[] | string{
        let returnOverSize : Partial<MessageEmbed>[] = [];
        if((type && (type === "awakening") || (type == "nonawakening"))) {
            let returnStructure : Partial<MessageEmbed> = {
                title: "Tricks for " +  type.toUpperCase(),
                fields: [],
                color : 16729156,
            }
            if((global.tricks as ITricks)[type].length > 25) {
                let tempTricks = _.clone(global.tricks[type]);
                let indexer = 0;
                while(tempTricks.length >= 25) {
                    let ret = tempTricks.splice(0,24).map((el : any) =>{
                        indexer++;
                        return {
                                name: ((global.client as Client).users.get(el.by) ?
                                    (global.client as Client).users.get(el.by).username
                                    : Number.isNaN(Number.parseInt(el.by)) ?
                                    el.by : el.by +  "(User is not known on any known server)") + isAdmin ? indexer - 1 : "",
                                value: el.trick,
                                inline: true,
                            }
                        });
                    returnOverSize.push({
                        title: "Tricks for " +  type.toUpperCase() + "("+ (returnOverSize.length + 1) +")",
                        fields: ret,
                        color : 16729156,
                    });
                }
                return returnOverSize;
            } else {
                returnStructure.fields = (global.tricks as ITricks)[type].map((el, ind) =>{
                    let name = 
                    (((global.client as Client).users.get(el.by) ?
                                (global.client as Client).users.get(el.by).username
                                : Number.isNaN(Number.parseInt(el.by)) ?
                                el.by : el.by +  "(User is not known on any known server)"))
                    if(isAdmin) {
                        name += +" ("+(ind).toString()+")";
                    }
                    return {
                            name: name,
                            value: el.trick,
                            embed: null,
                            inline: true,
                        }
                    });
                    return returnStructure;
            }
        } else {
            return "Which kind of tricks do you want? nonawakening or awakening?";
        }
    }

    /**
     * 
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    public static addTrick(type : "awakening" | "nonawakening", commitBy : string, trick : string) {
        global.tricks[type].push({
            trick: trick,
            by: commitBy,
            approved: {
                isApproved: true,
                approvedBy: "ADMINISTRATOR"
            }
        });
        Logwriter.writeLog("addTrick", "Trick was added and approved by an Administrator", "ADMINISTRATOR", false);
        DataSaver.saveJson("tricks.json", global.tricks);
    }

    /**
     * 
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    public static rmTrick(type : "awakening" | "nonawakening", commitBy : string, index : string) {
        try {
            global.tricks[type].splice(Number.parseInt(index), 1);
            Logwriter.writeLog("rmTrick", "Deleted trick with index " + index, commitBy, false);
            DataSaver.saveJson("tricks.json", global.tricks);
        } catch (err) {
            Logwriter.writeLog("rmTrick", "Tried to delete trick with index " + index + " but failed!", commitBy, false);
            console.log(err);
        }
    }
}