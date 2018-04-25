
//get discord types
import { Logwriter } from "../system/logwriter";
import { DataSaver } from "../system/saver";
import { IRotation } from "../../interfaces";



export class RotationProvider {
    /**
     * 
     * @param type This is "awakening" or "nonawakening"
     * @param position This is the position from the trick you want
     */
    public static getRotation(isAdmin : boolean, rotation? : string){
        if(rotation && (Number.parseInt(rotation) >= 0) && (Number.parseInt(rotation) < global.rotations.length)) {
            let rota = global.rotations[Number.parseInt(rotation)];
            return {
                embed:{
                    description: rota.rotation.description,
                    title: rota.rotation.name,
                    fields:[{
                        name: "Rotation",
                        inline: false,
                        value: rota.rotation.rotation.join(" > ")
                    }],
                    footer:{
                        text: "This rotation has been commited by " + rota.commitedBy,
                    }
                }
            }
        } else {
            let indexer = 0;
            let ret = []
            while(global.rotations.length >= 25) {
                let tempString = "";
                global.rotations.splice(0,25).forEach((el)=>{
                    tempString += el.rotation.name + " (" + indexer + ")\n";
                    indexer++;
                });
                ret.push(tempString);
                if(global.rotations.length === 0) return ret;
                
            }
            let tempString = "";
            global.rotations.forEach((el, index) => {
                tempString += el.rotation.name + " (" + index + ")\n";
            })
            return tempString;
        }
    }

    /**
     * 
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    public static addRotation(rotation : IRotation) {
        global.rotations.push(rotation);
        Logwriter.writeLog("addRotation", "Rotation was added and approved by an Administrator", "ADMINISTRATOR", false);
        DataSaver.saveJson("rotation.json", global.rotations);
    }

    /**
     * 
     * @param type type of trick. awakening or non awakening
     * @param trick
     */
    public static rmRotation(commitBy : string, index : string) {
        global.rotations.splice(Number.parseInt(index), 1);
        Logwriter.writeLog("rmRotation", "Rotation was removed by an Administrator", "ADMINISTRATOR", false);
        DataSaver.saveJson("rotation.json", global.rotations);
    }

    public static editRotation(index : string, rotation: IRotation) {
        global.rotations[Number.parseInt(index)] = rotation;
        Logwriter.writeLog("editRotation", "Rotation was edited and approved by an Administrator", "ADMINISTRATOR", false);
        DataSaver.saveJson("rotation.json", global.rotations);
    }
}