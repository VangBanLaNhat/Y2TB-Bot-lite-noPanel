var fs = require("fs");
var path = require("path");
var stripBom = require("strip-bom");
var log = require("./log.js");
var cf = require("./defaultConfig.js");

var dfcf = cf.normal();

var ccf = cf.core();

function getConfig(){
    var check = true;
    try {
        var t = fs.readFileSync(path.join(__dirname, "..", "..", "udata", "config.json"), {encoding: "utf8"})
    } catch (err) {check=false}
    if(check){
        try{
            var returnConfig = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "..", "..", "udata", "config.json"), {encoding: "utf8"})));
            var arr = Object.keys(dfcf);
            var ch = false;
            for (var i=0; i<arr.length; i++){
                if (returnConfig[arr[i]] == undefined) {
                    ch = true;
					typeof dfcf[arr[i]] == "object" ? log.warn("Config", `Missing "${arr[i]}" in config.json. Adding with default value`) : log.warn("Config", `Missing "${arr[i]}" in config.json. Adding with default value "${dfcf[arr[i]]}"`);
                    returnConfig[arr[i]]=dfcf[arr[i]];
                }
				if(typeof dfcf[arr[i]] == "object"){
					for(o=0; o<Object.keys(dfcf[arr[i]]).length; o++){
						if(returnConfig[arr[i]][Object.keys(dfcf[arr[i]])[o]] == undefined){
							ch = true;
							log.warn("Config", `Missing "${Object.keys(dfcf[arr[i]])[o]}" in config.json. Adding with value default "${dfcf[arr[i]][Object.keys(dfcf[arr[i]])[o]]}"`);
							returnConfig[arr[i]][Object.keys(dfcf[arr[i]])[o]]=dfcf[arr[i]][Object.keys(dfcf[arr[i]])[o]];
						}
					}
				}
            }
            var arr = Object.keys(returnConfig);
            for (var i=0; i<arr.length; i++){
                if (dfcf[arr[i]] == undefined) {
                    ch = true;
                    log.warn("Config", `Missing "${arr[i]}" in Default config. Deleted this`);
                    returnConfig[arr[i]] = undefined;
                }
				if(typeof dfcf[arr[i]] == "object"){
					for(o=0; o<Object.keys(returnConfig[arr[i]]).length; o++){
						if (dfcf[arr[i]][Object.keys(returnConfig[arr[i]])[o]] == undefined) {
							ch = true;
							log.warn("Config", `Missing "${Object.keys(returnConfig[arr[i]])[o]}" in Default config. Deleted this`);
							returnConfig[arr[i]][Object.keys(returnConfig[arr[i]])[o]] = undefined;
						}
					}
				}
            }
            if (ch) {
                fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "config.json"), JSON.stringify(returnConfig, null, 4), {mode: 0o666});
            }
        }
        catch (err){
            log.err("Config", "Got some error with your Config.json file");
            log.warn("Config", "Resetting all settings...");
            try {
                fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "config.json"), JSON.stringify(dfcf, null, 4), {mode: 0o666});
            }
            catch (ert) {
                log.log("Config", `Error resetting the settings: ${err}`);
            }
            var returnConfig = dfcf;
        }
    }
    else {
        log.warn("Config", "Config file not found. Creating a default one...");
		ensureExists(path.join(__dirname, "..", "..", "udata"));
        try {
            fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "config.json"), JSON.stringify(dfcf, null, 4), {mode: 0o666});
        }
        catch (err) {
            log.err("Config", `Cannot write default config, returned an error: ${err}`);
        }
        var returnConfig = dfcf;
    }
    return returnConfig;
};

function getCoreConfig(){
    var check = true;
    try {
        var t = fs.readFileSync(path.join(__dirname, "..", "..", "core", "coreconfig.json"), {encoding: "utf8"})
    } catch (err) {check=false}
    if(check){
        try{
            var returnConfig = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "..", "..", "core", "coreconfig.json"), {encoding: "utf8"})));
			var arr = Object.keys(ccf);
            var ch = false;
            for (var i=0; i<arr.length; i++){
                if (returnConfig[arr[i]] == undefined) {
                    ch = true;
					typeof ccf[arr[i]] == "object" ? log.warn("Config", `Missing "${arr[i]}" in coreconfig.json. Adding with default value`) : log.warn("Config", `Missing "${arr[i]}" in coreconfig.json. Adding with default value "${ccf[arr[i]]}"`)
                    returnConfig[arr[i]]=ccf[arr[i]];
                }
				if(typeof ccf[arr[i]] == "object"){
					for(o=0; o<Object.keys(ccf[arr[i]]).length; o++){
						if(returnConfig[arr[i]][Object.keys(ccf[arr[i]])[o]] == undefined){
							ch = true;
							log.warn("Config", `Missing "${Object.keys(ccf[arr[i]])[o]}" in coreconfig.json. Adding with default value "${ccf[arr[i]][Object.keys(ccf[arr[i]])[o]]}"`);
							returnConfig[arr[i]][Object.keys(ccf[arr[i]])[o]]=ccf[arr[i]][Object.keys(ccf[arr[i]])[o]];
						}
					}
				}
            }
            var arr = Object.keys(returnConfig);
            for (var i=0; i<arr.length; i++){
                if (ccf[arr[i]] == undefined) {
                    ch = true;
                    log.warn("Config", `Missing "${arr[i]}" in Default coreconfig. Deleted this`);
                    returnConfig[arr[i]] = undefined;
                }
				if(typeof ccf[arr[i]] == "object"){
					for(o=0; o<Object.keys(returnConfig[arr[i]]).length; o++){
						if (ccf[arr[i]][Object.keys(returnConfig[arr[i]])[o]] == undefined) {
							ch = true;
							log.warn("Config", `Missing "${Object.keys(returnConfig[arr[i]])[o]}" in Default coreconfig. Deleted this`);
							returnConfig[arr[i]][Object.keys(returnConfig[arr[i]])[o]] = undefined;
						}
						
					}
				}
            }
            if (ch) {
                fs.writeFileSync(path.join(__dirname, "..", "..", "core", "coreconfig.json"), JSON.stringify(returnConfig, null, 4), {mode: 0o666});
            }
		}
        catch (err){
            log.err("Config", "Got some error with your coreconfig.json file");
            log.warn("Config", "Resetting all settings...");
            try {
                fs.writeFileSync(path.join(__dirname, "..", "..", "core", "coreconfig.json"), JSON.stringify(ccf, null, 4), {mode: 0o666});
            }
            catch (ert) {
                log.err("Config", `Error resetting the settings: ${err}`);
            }
            var returnConfig = ccf;
        }
    }
    else {
        log.warn("Config", "coreconfig file not found. Creating a default one...");
        try {
            fs.writeFileSync(path.join(__dirname, "..", "..", "core", "coreconfig.json"), JSON.stringify(ccf, null, 4), {mode: 0o666});
        }
        catch (err) {
            log.log("Config", `Cannot write default coreconfig, returned an error: ${err}`);
        }
        var returnConfig = ccf;
    }
    return returnConfig;
};

function ensureExists(path, mask) {
  if (typeof mask != 'number') {
    mask = 0o777;
  }
  try {
    fs.mkdirSync(path, {
      mode: mask,
      recursive: true
    });
    return;
  } catch (ex) {
    return {
      err: ex
    };
  }
}

module.exports = {
    getConfig,
    getCoreConfig
}