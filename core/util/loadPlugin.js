const scanDir=require("./scanDir.js")
const path = require("path");

async function loadMainPlugins(){
    !global.plugins ? global.plugins = {}:"";
    !global.chathook ? global.chathook = {}:"";
    var list = scanDir(".js", path.join(__dirname, "..", "loadPlugins"));
    for (var i = 0; i < list.length; i++) {
        console.log("Plugins", `Loading main plugins "${list[i]}"...`);
        try{
            let mainPlugins = require(path.join(__dirname, "..", "loadPlugins", list[i]))
            await mainPlugins.loadPlugins()
        }
        catch(err){
            console.error("Plugins", `Can't load main plugins "${list[i]}" with error: ${err}`);
        }
    }
}

module.exports = loadMainPlugins;