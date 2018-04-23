

var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))


router.get("/", (req : any, res : any) => {
    res.send({
        apiVersion: "v1-1.0.0",
        informations: "Zerkbot Api. No routes are configured yet",
        additionalInfo: "Zerkbot is an Bot used for making the Zerklife easier"
    })
});


exports.v1= router;