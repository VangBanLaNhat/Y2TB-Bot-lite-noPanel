const scanDir=require("./scanDir.js")
const path = require("path");

async function unloadMainPlugins(){
    !global.plugins ? global.plugins = {}:"";
    global.chathook = {}; // Clear chathook function.
    var list = scanDir(".js", path.join(__dirname, "..", "loadPlugins")); // Get list main plugins
    for (var i = 0; i < list.length; i++) {
        let dirMain = path.join(__dirname, "..", "loadPlugins", list[i])

        if (require.cache[dirMain]) {
			delete require.cache[dirMain];
		} // Unrequire main plugins avoid causing conflict

        let mainPlugins = require(dirMain);
        try{
            await mainPlugins.unloadPlugins()
        }
        catch(err){
            console.err("Plugins", `Can't unload main plugins "${list[i]}" with error: ${err}`);
        }
    }
}

module.exports = unloadMainPlugins;