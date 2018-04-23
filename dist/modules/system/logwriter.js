"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logwriter {
    static writeLog(action, message, uid, apiCall) {
        global.client.channels.get(global.settings.log).send(`\`${apiCall ? "API_CALL=" : ""} ${new Date().toISOString()} : (${action}) [${uid}] : ${message}\``);
        console.info(`${apiCall ? "API_CALL=" : ""} ${new Date().toISOString()} : (${action}) [${uid}] : ${message}`);
    }
}
exports.Logwriter = Logwriter;
