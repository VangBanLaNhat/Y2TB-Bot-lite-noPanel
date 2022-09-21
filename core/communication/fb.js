const login = require("fca-unofficial");
const fs = require("fs");
const path = require("path");
const listen = require(path.join(__dirname, "listen.js"))
var log = require(path.join(__dirname, "..", "util", "log.js"));
var { requireFromString } = require('module-from-string');


module.exports = async (appState, loginOptions) => {
    var opts = loginOptions;
    delete opts["userAgent"];
    var ch = false;
	
    login({ appState }, opts, async (err, api) => {
        if (err) {
            fs.unlinkSync(path.join(__dirname, "..", "..", "udata", "fbstate.json"));
            log.err("Login", err);
            process.exit(1);
        }
        if(!ch){
            global.botid = api.getCurrentUserID()+"";
            ch = true;
        }


        log.log("Manager","Login successfuly!");
        for(let i in global.plugins.VBLN.plugins){
            try{
                await global.plugins.VBLN.plugins[i].loginFunc();
            } catch(e){}
        }
        try{
		  api.listenMqtt((err, event) => {
		  	listen(err, event, api);
		  });
        } catch (e) {/*console.error("ListenMqtt", e)*/};
    })
}
