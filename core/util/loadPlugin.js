const scanDir=require("./scanDir.js")
const path = require("path");
const log = require("./log.js");

async function loadMainPlugins(){
    !global.plugins ? global.plugins = {}:"";
    !global.chathook ? global.chathook = {}:"";
    var list = scanDir(".js", path.join(__dirname, "..", "loadPlugins"));
    for (var i = 0; i < list.length; i++) {
        log.log("Plugins", `Loading main plugins "${list[i]}"...`);
        try{
            var lo = require(path.join(__dirname, "..", "loadPlugins", list[i]))
            await lo()
        }
        catch(err){
            log.err("Plugins", `Can't load main plugins "${list[i]}" with error: ${err}`);
        }
    }
}

module.exports = loadMainPlugins;