const fs = require('fs');
const path = require("path");
const stripBom = require("strip-bom");
const log = require(path.join(__dirname, "log.js"));
const scanDir = require(path.join(__dirname, "scanDir.js"));

function loadLang() {
    !global.lang ? global.lang = {}:"";
    var dirLang = path.join(__dirname, "..", "..", "lang");
    ensureExists(path.join(dirLang, "backup"));
    var listLang = scanDir(".json", dirLang);
    var plugins = [];
    /*Object.keys(global.plugins.VBLN.command).forEach(x => {
        plugins.indexOf(global.plugins.VBLN.command[x].namePlugin) == -1 ? plugins.push(global.plugins.VBLN.command[x].namePlugin) : "";
    });*/
    for (var i = 0; i < listLang.length; i++) {
        var pluginName = listLang[i].split(".")[0];
        //pluginName.splice(pluginName.length-1,1);
        //console.log(pluginName);
        //pluginName = pluginName.toString(".");
        if(global.plugins.VBLN.plugins[pluginName] && global.plugins.VBLN.plugins[pluginName].lang){
            try{
                var lang = JSON.parse(stripBom(fs.readFileSync(path.join(dirLang, listLang[i]), {encoding: "utf8"})));
                !global.lang[pluginName] ? global.lang[pluginName] = lang:"";
                log.log("Languages", `Loaded language for plugin "${pluginName}"`);
            }
            catch(err){
                log.err("Languages", `Can't load language for plugin "${pluginName}" with error: ${err}`);
            }
        } else {
            if(global.coreconfig.main_bot.developMode) continue;
            fs.renameSync(path.join(dirLang, listLang[i]), path.join(dirLang, "backup", listLang[i]));
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

module.exports = loadLang;