import * as fs from "fs";

export class DataSaver{
    /**
     * Speicherfunktion
     * @param {*} path // will be saved in DATA. So if you just want to save the file in DATA, you only need to type "filename.json" 
     * @param {*} data 
     */
    public static saveJson(path : string, data : any) {
        console.log("Saving " + path + "...")
        if (fs.existsSync("./DATA/"+path)) {
            fs.writeFile("./DATA/"+path, JSON.stringify(data), (err:any) => {
                if (err) console.error(err);
                console.log("Saved " + path + "...")
            })
        } else {
            fs.unlink("./DATA/"+path, (err) => {
                if (err) console.error(err);
                fs.writeFile("./DATA/"+path, JSON.stringify(data), (err) => {
                    if (err) console.error(err);
                })
                console.log("Saved " + path + "...")
            })
    
        }
      
    }

}


