export class Logwriter {
    public static writeLog(action: string, message : string, uid : string, apiCall: boolean) {
        global.client.channels.get(global.settings.log).send(
            `\`${apiCall ? "API_CALL=" : ""} ${new Date().toISOString()} : (${action}) [${uid}] : ${message}\``
        );
        console.info(`${apiCall ? "API_CALL=" : ""} ${new Date().toISOString()} : (${action}) [${uid}] : ${message}`);
    }
}