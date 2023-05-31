const login = require("fca-unofficial");
const fs = require("fs");
const path = require("path");
const listen = require(path.join(__dirname, "listen.js"))
var log = require(path.join(__dirname, "..", "util", "log.js"));

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
        for(let i in global.plugins.Y2TB.plugins){
            try{
            	let adv = {
            		pluginName: i,
            		lang: global.lang[i],
            		iso639: global.config.bot_info.lang,
            		config: global.config[i],
            		replaceMap: replaceMap
            	};
                await global.plugins.Y2TB.plugins[i].loginFunc(api, adv);
                delete global.plugins.Y2TB.plugins[i].loginFunc;
            } catch(e){}
        }
        try{
		  api.listenMqtt((err, event) => {
		  	listen(err, event, api);
		  });
        } catch (e) {/*console.error("ListenMqtt", e)*/};
    })
}

function replaceMap(str, map){
	for(let i in map)
		str = str.replaceAll(i, map[i]);
	return str;
}