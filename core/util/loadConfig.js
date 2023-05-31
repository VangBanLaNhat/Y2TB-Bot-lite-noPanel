const fs = require('fs');
const path = require("path");
const stripBom = require("strip-bom");
const log = require(path.join(__dirname, "log.js"));
const scanDir = require(path.join(__dirname, "scanDir.js"));

function loadConfig() {
    !global.config ? global.config = {}:"";
    var dirConfig = path.join(__dirname, "..", "..", "udata", "Plugins config");
    ensureExists(path.join(dirConfig, "backup"));
    var listConfig = scanDir(".json", dirConfig);
    var plugins = [];
    for (var i = 0; i < listConfig.length; i++) {
        var pluginName = listConfig[i].split(".json")[0];
        if(global.plugins.Y2TB.plugins[pluginName] && global.plugins.Y2TB.plugins[pluginName].config){
            try{
                var config = JSON.parse(stripBom(fs.readFileSync(path.join(dirConfig, listConfig[i]), {encoding: "utf8"})));
                !global.config[pluginName] ? global.config[pluginName] = config:"";
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