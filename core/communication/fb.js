const login = require("fca-unofficial");
const fs = require("fs");
const path = require("path");
const listen = require(path.join(__dirname, "listen.js"))
var log = require(path.join(__dirname, "..", "util", "log.js"));

module.exports = async (appState, loginOptions) => {
    var opts = loginOptions;
    delete opts["userAgent"];
	
    login({ appState }, opts, async (err, api) => {
        if (err) {
            fs.unlinkSync(path.join(__dirname, "..", "..", "udata", "fbstate.json"));
            log.err("Login", err);
            process.exit(1);
        }
        if(!global.botid){
            global.botid = api.getCurrentUserID()+"";
            //global.fbapi = api;
        }


        log.log("Manager","Login successfuly!");
        for(let i in global.plugins.Y2TB.plugins){
            try{
            	let adv = {
            		pluginName: i,
            		lang: global.lang[i],
            		rlang: (inp)=>{
                    		return global.lang[i][inp][global.config.bot_info.lang];
                    	},
            		iso639: global.config.bot_info.lang,
            		config: global.configPl[i],
            		replaceMap: replaceMap,
            		getUserInfo: api.getUserInfo,
                    getThreadInfo: api.getThreadInfo
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
 str = str+"";
	for(let i in map)
		str = str.replaceAll(i, map[i]);
	return str;
}