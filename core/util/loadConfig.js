const fs = require('fs');
const path = require("path");
const stripBom = require("strip-bom");
const log = require(path.join(__dirname, "log.js"));
const scanDir = require(path.join(__dirname, "scanDir.js"));

function loadConfig() {
    !global.configPl ? global.configPl = {}:"";
    var dirConfig = path.join(__dirname, "..", "..", "udata", "Plugins config");
    //console.log(dirConfig)
    ensureExists(path.join(dirConfig, "backup"));
    var listConfig = scanDir(".json", dirConfig);
    //console.log(listConfig)
    var plugins = [];
    for (let i in listConfig) {
        var pluginName = listConfig[i].split(".json")[0];
        if(global.plugins.Y2TB.plugins[pluginName] && global.plugins.Y2TB.plugins[pluginName].config){
            try{
                let config = JSON.parse(fs.readFileSync(path.join(dirConfig, listConfig[i]), {encoding: "utf8"}));
                !global.configPl[pluginName] ? global.configPl[pluginName] = config:"";
                log.log("Config", `Loaded config for plugin "${pluginName}"`);
            }
            catch(err){
                log.err("Config", `Can't load config for plugin "${pluginName}" with error: ${err}`);
            }
        } else {
            if(global.coreconfig.main_bot.developMode) continue;
            fs.renameSync(path.join(dirConfig, listConfig[i]), path.join(dirConfig, "backup", listConfig[i]));
        }
    }
}

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

module.exports = loadConfig;