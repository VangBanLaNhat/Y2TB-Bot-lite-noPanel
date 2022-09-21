const axios = require('axios');
const AdmZip = require("adm-zip");
var { requireFromString } = require('module-from-string');
const fs = require('fs');
const path = require("path");
const cmd = require('child_process');
const stripBom = require("strip-bom");
const log = require(path.join(__dirname, "..", "util", "log.js"));
const scanDir = require(path.join(__dirname, "..", "util", "scanDir.js"));

async function loadPlugin(){
    
    !global.plugins.VBLN ? global.plugins.VBLN = {}:"";
    !global.plugins.VBLN.command ? global.plugins.VBLN.command = {}:"";

    if(global.coreconfig.main_bot.developMode){
        log.log("Plugins(VBLN)", "In developer mode only develop plugin and plugin eval, help, devtool can load!");
        var list = scanDir(".js", path.join(__dirname, "..", "..", "plugins"));
        ensureExists(path.join(__dirname, "..", "..", "plugins", "cache"));
        var listFile = [];
        for(var i=0; i<list.length; i++){
            var check = path.join(__dirname, "..", "..", "plugins", list[i]);
            if (!fs.lstatSync(check).isDirectory()) {
                try {
                    var pluginInfo = await requireFromString({
                        code: fs.readFileSync(path.join(__dirname, "..", "..", "plugins", list[i])).toString(),
                        globals: { 
                            __dirname: path.join(__dirname, "..", "..", "plugins"),
                            Buffer: Buffer,
                            global: globalC,
                            console: console,
                            process: process,
                            clearInterval: clearInterval,
                            clearTimeout: clearTimeout,
                            setInterval: setInterval,
                            setTimeout: setTimeout 
                        }
                    }).init();  
                    var func = fs.readFileSync(path.join(__dirname, "..", "..", "plugins", list[i])).toString();
                    var t = installmd(list[i], pluginInfo);
                    load(list[i], pluginInfo, func, true);
                }
                catch(err){
                    log.err("Plugins(VBLN)", "Can't load \""+list[i]+"\" with error: "+err)
                }
                
            }
        }
    }
    if(global.coreconfig.main_bot.developMode){
        var list = {
            "Eval.js": (await axios.get(`https://api.maihuybao.repl.co/storage?mode=info&file=Eval.js`)).data.data.ver,
            "Help.js": (await axios.get(`https://api.maihuybao.repl.co/storage?mode=info&file=Help.js`)).data.data.ver
        }
    }
    else {
        var list = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "plugins", "pluginList.json")).toString());
    }
    var name = Object.keys(list);
    var data = [];
    var i;
    var res;
    global.coreconfig.main_bot.developMode ? res = await axios(`https://api.maihuybao.repl.co/plugin?file=Eval.js,Help.js`) : res = await axios(`https://api.maihuybao.repl.co/plugin?file=${name.join(",")}`);
    var files = res.data.data;
    var res = await axios.get(`https://api.maihuybao.repl.co/storage`);
    ensureExists(path.join(__dirname, "..", "..", "plugins", "obb"));
    var obb = res.data.data.filter(x => x.obb != undefined);
    for(i=0;i<obb.length;i++){
        if(fs.existsSync(path.join(__dirname, "obb", obb[i].obb.slice(0, obb[i].obb.length - 4)))){
            if(list[obb[i].file] != obb[i].ver){
                //removeDir(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
                async function download(){
                    res = await axios({
                        url: `https://api.maihuybao.repl.co/obb?file=${obb[i].obb}`,
                        method: "GET",
                        responseType: "stream",
                    });
                    var writer = fs.createWriteStream(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
                    res.data.pipe(writer);
                    return new Promise((resolve, reject) => {
                        writer.on('finish', resolve)
                        writer.on('error', reject)
                    })
                }

                await download();
                var zip = new AdmZip(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
                zip.extractAllTo(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb.slice(0, obb[i].obb.length - 4)), true);
                fs.unlinkSync(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
                list[obb[i].file] = obb[i].ver;
                fs.writeFileSync(path.join(__dirname, "..", "..", "plugins", "pluginList.json"), JSON.stringify(list));
            }
        }
        else {
            async function download(){
                res = await axios({
                    url: `https://api.maihuybao.repl.co/obb?file=${obb[i].obb}`,
                    method: "GET",
                    responseType: "stream",
                });
                var writer = fs.createWriteStream(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
                res.data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve)
                    writer.on('error', reject)
                })
            }

            await download();
            var zip = new AdmZip(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
            ensureExists(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb.slice(0, obb[i].obb.length - 4)));
            zip.extractAllTo(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb.slice(0, obb[i].obb.length - 4)), true);
            fs.unlinkSync(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
        }
    }
    for(i=0;i<name.length;i++){
        try{
            var pluginInfo = await requireFromString({
                code: files[name[i]],
                globals: { 
                    __dirname: path.join(__dirname, "..", "..", "plugins"),
                    Buffer: Buffer,
                    global: globalC,
                    console: console,
                    process: process,
                    clearInterval: clearInterval,
                    clearTimeout: clearTimeout,
                    setInterval: setInterval,
                    setTimeout: setTimeout 
                }
            }).init();
            var func = files[name[i]];
            var t = installmd(name[i], pluginInfo);
            load(name[i], pluginInfo, func);
        }
        catch(err){
            log.err("Plugins(VBLN)", "Can't load \""+name[i]+"\" with error: "+err)
        }
    }

    if(!global.coreconfig.main_bot.developMode){
        ensureExists(path.join(__dirname, "..", "..", "plugins", "obb"));
        let listObb = fs.readdirSync(path.join(__dirname, "..", "..", "plugins", "obb"));
        for(let i of listObb)
            if(!global.plugins.VBLN.obb[i] && i != "Backup"){
                ensureExists(path.join(__dirname, "..", "..", "plugins", "obb", "Backup"));
                let zip = new AdmZip();
                zip.addLocalFolder(path.join(__dirname, "..", "..", "plugins", "obb", i))
                zip.writeZip(path.join(__dirname, "..", "..", "plugins", "obb", "Backup", i+".zip"))
                removeDir(path.join(__dirname, "..", "..", "plugins", "obb", i));
            };
    }
}


function load(file, pluginInfo, func, devmode){
    try{
        let fullFunc = requireFromString({
            code: func,
            globals: { 
                __dirname: path.join(__dirname, "..", "..", "plugins"),
                Buffer: Buffer,
                global: global.globalC,
                console: console,
                process: process,
                clearInterval: clearInterval,
                clearTimeout: clearTimeout,
                setInterval: setInterval,
                setTimeout: setTimeout
            }
        })
        //var funcmain = require(path.join(__dirname, "..", "..", "plugins", file));
        !global.plugins.VBLN.plugins ? global.plugins.VBLN.plugins = {}:"";
        !global.plugins.VBLN.plugins[pluginInfo.pluginName] ? global.plugins.VBLN.plugins[pluginInfo.pluginName] = {
            "author": pluginInfo.author,
            "version": pluginInfo.version,
            "loginFunc": fullFunc[pluginInfo.loginFunc],
            "lang": false
        }:"";
        !global.plugins.VBLN.plugins.listen ? global.plugins.VBLN.plugins.listen = {
            "lang": true
        }:"";

        !global.plugins.VBLN.obb ? global.plugins.VBLN.obb = {}:"";
        pluginInfo.obb ? global.plugins.VBLN.obb[pluginInfo.obb] = pluginInfo.pluginName:"";

        for(var i in pluginInfo.commandList){
            !global.plugins.VBLN.command[i] ? global.plugins.VBLN.command[i] = {}:"";
            !global.plugins.VBLN.command[i].help ? global.plugins.VBLN.command[i].namePlugin = pluginInfo.pluginName:"";
            !global.plugins.VBLN.command[i].help ? global.plugins.VBLN.command[i].help = pluginInfo.commandList[i].help:"";
            !global.plugins.VBLN.command[i].tag ? global.plugins.VBLN.command[i].tag = pluginInfo.commandList[i].tag:"";
            !global.plugins.VBLN.command[i].main ? global.plugins.VBLN.command[i].main = func :"";
            !global.plugins.VBLN.command[i].mainFunc ? global.plugins.VBLN.command[i].mainFunc = pluginInfo.commandList[i].mainFunc:"";
        }
        if(typeof pluginInfo.langMap == "object"){
            if(global.coreconfig.main_bot.developMode){
                fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(pluginInfo.langMap, null, 4), {mode: 0o666});
                global.plugins.VBLN.plugins[pluginInfo.pluginName].lang = true;

            }
            else {
                if(!fs.existsSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`))){
                    if(!fs.existsSync(path.join(__dirname, "..", "..", "lang", "backup", `${pluginInfo.pluginName}.json`)))
                        fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(pluginInfo.langMap, null, 4), {mode: 0o666})
                    else {
                        fs.renameSync(path.join(__dirname, "..", "..", "lang", "backup", `${pluginInfo.pluginName}.json`), path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`))
                        //Check lang.json file
                        var langjs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`)));
                        for (let l in langjs)
                            !pluginInfo.langMap[l] ? delete langjs[l]:"";
                        //Check plugin
                        for (let l in pluginInfo.langMap)
                            !langjs[l] ? langjs[l] = pluginInfo.langMap[l]:"";
                        fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(langjs, null, 4), {mode: 0o666});
                    }
                } else {
                    //Check lang.json file
                    var langjs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`)));
                    for (let l in langjs)
                        !pluginInfo.langMap[l] ? delete langjs[l]:"";
                    //Check plugin
                    for (let l in pluginInfo.langMap)
                        !langjs[l] ? langjs[l] = pluginInfo.langMap[l]:"";
                    fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(langjs, null, 4), {mode: 0o666});
                }
                global.plugins.VBLN.plugins[pluginInfo.pluginName].lang = true;
            }
        }
        if(typeof pluginInfo.chathook == "string"){
            !global.chathook[pluginInfo.pluginName] ? global.chathook[pluginInfo.pluginName] = {
                main: func,
                func: pluginInfo.chathook
            }:"";
        }
        global.coreconfig.main_bot.developMode ? log.log("Plugins(VBLN)", "Loaded devplugin: "+pluginInfo.pluginName+" "+pluginInfo.version+" by "+pluginInfo.author) : log.log("Plugins(VBLN)", "Loaded plugin: "+pluginInfo.pluginName+" "+pluginInfo.version+" by "+pluginInfo.author)
    }
    catch(err){
        log.err("Plugins(VBLN)", "Can't load \""+file+"\" with error: "+err)
    }
}

function installmd(file, pluginInfo){
    if(typeof pluginInfo.nodeDepends == "object"){
        for (var i in pluginInfo.nodeDepends){
            /*var ch = true;
            try{
                var a = require(i)
            }catch (e){
                console.log(e)
                ch = false
            }*/
            
            //if (!ch) {
            if (!fs.existsSync(path.join(__dirname, "..", "..", "node_modules", i, "package.json"))) {
                
                log.warn("Plugins(VBLN)", "Installing Node_module \""+i+"\" for plugin \""+pluginInfo.pluginName+"\":\n");
                if(pluginInfo.nodeDepends[i] != ""){
                    cmd.execSync(`npm install --save ${i}@${pluginInfo.nodeDepends[i]}`,{
                        stdio: "inherit",
                        env: process.env,
                        shell: true
                    })
                }
                else{
                    cmd.execSync(`npm install --save ${i}`,{
                        stdio: "inherit",
                        env: process.env,
                        shell: true
                    })
                }
            }
        }
    }
}
function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

function removeDir(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function(filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename)
        } else {
          fs.unlinkSync(path + "/" + filename)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.rmdirSync(path)
    }
  } else {
    console.log("Directory path not found.")
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

module.exports = loadPlugin;