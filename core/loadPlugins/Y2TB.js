const axios = require('axios');
const AdmZip = require("adm-zip");
//const {requireFromString} = require('module-from-string');
const enc = require("enc");
const fs = require('fs');
const path = require("path");
const cmd = require('child_process');
const stripBom = require("strip-bom");
const {
	link
} = require('fs/promises');
const {
	Octokit
} = require("@octokit/rest");
const octokit = new Octokit({});
const log = require(path.join(__dirname, "..", "util", "log.js"));
const scanDir = require(path.join(__dirname, "..", "util", "scanDir.js"));
!global.temp ? global.temp = {}:"";
!global.temp.loadPlugin ? global.temp.loadPlugin = {}:"";

async function loadPlugin() {
	!global.plugins.Y2TB ? global.plugins.Y2TB = {}: "";
	!global.plugins.Y2TB.command ? global.plugins.Y2TB.command = {}: "";


	ensureExists(path.join(__dirname, "..", "..", "plugins", "obb"));
	if (global.coreconfig.main_bot.developMode) {
		log.log("Plugins(Y2TB)", "In developer mode only develop plugin and plugin eval, help, plugins store can load!");
		var list = scanDir(".js", path.join(__dirname, "..", "..", "plugins"));
		ensureExists(path.join(__dirname, "..", "..", "plugins", "cache"));
		var listFile = [];
		for (var i = 0; i < list.length; i++) {
			var check = path.join(__dirname, "..", "..", "plugins", list[i]);
			if (!fs.lstatSync(check).isDirectory()) {
				try {
					let pluginInfo = await evelStringSync(fs.readFileSync(path.join(__dirname, "..", "..", "plugins", list[i])).toString(), list[i], true).init();
					var func = fs.readFileSync(path.join(__dirname, "..", "..", "plugins", list[i])).toString();
					var t = installmd(list[i], pluginInfo);
					load(list[i], pluginInfo, func, true);
				}
				catch (err) {
					log.err("Plugins(Y2TB)", "Can't load \"" + list[i] + "\" with error: " + err);
					!global.temp.loadPlugin.stderr ? global.temp.loadPlugin.stderr = []:"";
					global.temp.loadPlugin.stderr.push({
						plugin: list[i],
						error: err
					})
				}

			}
		}
	}
	!global.data.pluginTemp ? global.data.pluginTemp = {
		"Eval.js": "0.0.0",
		"Help.js": "0.0.0",
		"pluginsStore.js": "0.0.0"
	}: "";
	if (global.coreconfig.main_bot.developMode) {
		var list = {
			"Eval.js": "0.0.0",
			"Help.js": "0.0.0",
			"pluginsStore.js": "0.0.0"
		}
	} else {
		var list = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "plugins", "pluginList.json")).toString());
	}
	var name = Object.keys(list);
	var data = [];
	var i;
	var res;
	/*global.coreconfig.main_bot.developMode ? res = await axios(`https://api.maihuybao.repl.co/plugin?file=Eval.js,Help.js`) : res = await axios(`https://api.maihuybao.repl.co/plugin?file=${name.join(",")}`);
    var files = res.data.data;
    var res = await axios.get(`https://api.maihuybao.repl.co/storage`);
    ensureExists(path.join(__dirname, "..", "..", "plugins", "obb"));
    var obb = res.data.data.filter(x => x.obb != undefined);
    for (i = 0; i < obb.length; i++) {
        if (fs.existsSync(path.join(__dirname, "obb", obb[i].obb.slice(0, obb[i].obb.length - 4)))) {
            if (list[obb[i].file] != obb[i].ver) {
                //removeDir(path.join(__dirname, "..", "..", "plugins", "obb", obb[i].obb));
                async function download() {
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
            async function download() {
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
    }*/
	//process.exit();
	for (i = 0; i < name.length; i++) {
		try {
			let func = await getFileContent(name[i]);
			if (!func) {
				
				throw new Error("Can't load \"" + name[i] + "\" with error: " + err);
			}
			let pluginInfo = await evelStringSync(func, name[i]).init();
			var t = installmd(name[i], pluginInfo);
			await load(name[i], pluginInfo, func);
		}
		catch (err) {
			log.err("Plugins(Y2TB)", "Can't load \"" + name[i] + "\" with error: " + err)
			!global.temp.loadPlugin.stderr ? global.temp.loadPlugin.stderr = []:"";
			global.temp.loadPlugin.stderr.push({
				plugin: list[i],
				error: err
			})
		}
	}
	/*if (!global.coreconfig.main_bot.developMode) {
        ensureExists(path.join(__dirname, "..", "..", "plugins", "obb"));
        let listObb = fs.readdirSync(path.join(__dirname, "..", "..", "plugins", "obb"));
        for (let i of listObb)
            if (!global.plugins.Y2TB.obb[i] && i != "Backup") {
                ensureExists(path.join(__dirname, "..", "..", "plugins", "obb", "Backup"));
                let zip = new AdmZip();
                zip.addLocalFolder(path.join(__dirname, "..", "..", "plugins", "obb", i))
                zip.writeZip(path.join(__dirname, "..", "..", "plugins", "obb", "Backup", i + ".zip"))
                removeDir(path.join(__dirname, "..", "..", "plugins", "obb", i));
            };
    }*/
}

async function load(file, pluginInfo, func, devmode) {
	try {
		//Load obb
		
		if (pluginInfo.obb && (!fs.existsSync(path.join(__dirname, "..", "..", "plugins", "obb", pluginInfo.obb)) || pluginInfo.version != global.data.pluginTemp[pluginInfo.pluginName])) {
			console.warn(pluginInfo.pluginName, "Updating obb: " + pluginInfo.obb);
			try {
				if (fs.existsSync(path.join(__dirname, "..", "..", "plugins", "obb", pluginInfo.obb))) fs.unlinkSync(path.join(__dirname, "..", "..", "plugins", "obb", pluginInfo.obb));
				await downloadfile(pluginInfo.obb + ".zip");
				let zip = new AdmZip(path.join(__dirname, "..", "..", "plugins", "obb", pluginInfo.obb + ".zip"));
				zip.extractAllTo(path.join(__dirname, "..", "..", "plugins", "obb", pluginInfo.obb), true);
				fs.unlinkSync(path.join(__dirname, "..", "..", "plugins", "obb", pluginInfo.obb + ".zip"));
				console.warn(pluginInfo.pluginName, "Successfully installed obb " + pluginInfo.obb);
			} catch (e) {
				console.error(pluginInfo.pluginName, "Can't install obb "+ pluginInfo.obb +": Does not exist in the database or has been corrupted!", e);
				!global.temp.loadPlugin.stderr ? global.temp.loadPlugin.stderr = []:"";
				global.temp.loadPlugin.stderr.push({
					plugin: pluginInfo.pluginName,
					error: "Can't install obb "+ pluginInfo.obb +": Does not exist in the database or has been corrupted!; "+e
				})
			}
		}
		
		//Require plugin
		
		let fullFunc = evelStringSync(func);
		
		//Push plugin info to global
		
		!global.plugins.Y2TB.plugins ? global.plugins.Y2TB.plugins = {}: "";
		!global.plugins.Y2TB.plugins[pluginInfo.pluginName] ? global.plugins.Y2TB.plugins[pluginInfo.pluginName] = {
			"author": pluginInfo.author,
			"version": pluginInfo.version,
			"loginFunc": fullFunc[pluginInfo.loginFunc],
			"fullFunc": fullFunc,
			"lang": false
		}: "";
		global.data.pluginTemp[pluginInfo.pluginName] = pluginInfo.version;
		!global.plugins.Y2TB.plugins.listen ? global.plugins.Y2TB.plugins.listen = {
			"lang": true
		}: "";

		!global.plugins.Y2TB.obb ? global.plugins.Y2TB.obb = {}: "";
		pluginInfo.obb ? global.plugins.Y2TB.obb[pluginInfo.obb] = pluginInfo.pluginName: "";

		for (var i in pluginInfo.commandList) {
			!global.plugins.Y2TB.command[i] ? global.plugins.Y2TB.command[i] = {}: "";
			!global.plugins.Y2TB.command[i].help ? global.plugins.Y2TB.command[i].namePlugin = pluginInfo.pluginName: "";
			!global.plugins.Y2TB.command[i].help ? global.plugins.Y2TB.command[i].help = pluginInfo.commandList[i].help: "";
			!global.plugins.Y2TB.command[i].tag ? global.plugins.Y2TB.command[i].tag = pluginInfo.commandList[i].tag: "";
			//!global.plugins.Y2TB.command[i].main ? global.plugins.Y2TB.command[i].main = pluginInfo.pluginName: "";
			!global.plugins.Y2TB.command[i].mainFunc ? global.plugins.Y2TB.command[i].mainFunc = pluginInfo.commandList[i].mainFunc: "";
		}
		
		//Load language 
		
		if (typeof pluginInfo.langMap == "object") {
			if (global.coreconfig.main_bot.developMode) {
				fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(pluginInfo.langMap, null, 4), {
					mode: 0o666
				});
				global.plugins.Y2TB.plugins[pluginInfo.pluginName].lang = true;

			} else {
				if (!fs.existsSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`))) {
					if (!fs.existsSync(path.join(__dirname, "..", "..", "lang", "backup", `${pluginInfo.pluginName}.json`)))
						fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(pluginInfo.langMap, null, 4), {
						mode: 0o666
					})
					else {
						fs.renameSync(path.join(__dirname, "..", "..", "lang", "backup", `${pluginInfo.pluginName}.json`), path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`))
						//Check lang.json file
						var langjs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`)));
						for (let l in langjs)
							!pluginInfo.langMap[l] ? delete langjs[l]: "";
						//Check plugin
						for (let l in pluginInfo.langMap)
							!langjs[l] ? langjs[l] = pluginInfo.langMap[l]: "";
						fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(langjs, null, 4), {
							mode: 0o666
						});
					}
				} else {
					//Check lang.json file
					var langjs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`)));
					for (let l in langjs)
						!pluginInfo.langMap[l] ? delete langjs[l]: "";
					//Check plugin
					for (let l in pluginInfo.langMap)
						!langjs[l] ? langjs[l] = pluginInfo.langMap[l]: "";
					fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `${pluginInfo.pluginName}.json`), JSON.stringify(langjs, null, 4), {
						mode: 0o666
					});
				}
				global.plugins.Y2TB.plugins[pluginInfo.pluginName].lang = true;
			}
		}
		
		//Load plugin config
		
		if (typeof pluginInfo.config == "object") {
			ensureExists(path.join(__dirname, "..", "..", "udata", "Plugins config"));
			if (global.coreconfig.main_bot.developMode) {
				fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`), JSON.stringify(pluginInfo.config, null, 4), {
					mode: 0o666
				});
				global.plugins.Y2TB.plugins[pluginInfo.pluginName].config = true;
			} else {
				if (!fs.existsSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`))) {
					if (!fs.existsSync(path.join(__dirname, "..", "..", "udata", "Plugins config", "backup", `${pluginInfo.pluginName}.json`)))
						fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`), JSON.stringify(pluginInfo.config, null, 4), {
						mode: 0o666
					})
					else {
						fs.renameSync(path.join(__dirname, "..", "..", "udata", "Plugins config", "backup", `${pluginInfo.pluginName}.json`), path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`))
						//Check config.json file
						var configjs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`)));
						for (let l in configjs)
							pluginInfo.config[l] == undefined ? delete configjs[l]: "";
						//Check plugin
						for (let l in pluginInfo.config)
							configjs[l] == undefined ? configjs[l] = pluginInfo.config[l]: "";
						fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`), JSON.stringify(configjs, null, 4), {
							mode: 0o666
						});
					}
				} else {
					//Check config.json file
					var configjs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`)));
					for (let l in configjs)
						pluginInfo.config[l] == undefined ? delete configjs[l]: "";
					//Check plugin
					for (let l in pluginInfo.config)
						configjs[l] == undefined ? configjs[l] = pluginInfo.config[l]: "";
					fs.writeFileSync(path.join(__dirname, "..", "..", "udata", "Plugins config", `${pluginInfo.pluginName}.json`), JSON.stringify(configjs, null, 4), {
						mode: 0o666
					});
				}
				global.plugins.Y2TB.plugins[pluginInfo.pluginName].config = true;
			}
		}
		
		//Load chathook
		
		if (typeof pluginInfo.chathook == "string") {
			!global.chathook[pluginInfo.pluginName] ? global.chathook[pluginInfo.pluginName] = {
				main: pluginInfo.pluginName,
				func: pluginInfo.chathook
			}: "";
		}
		if(pluginInfo.onload){
			//console.log(fullFunc);
			fullFunc[pluginInfo.onload](pluginInfo);
		}
		global.coreconfig.main_bot.developMode ? log.log("Plugins(Y2TB)", "Loaded devplugin: " + pluginInfo.pluginName + " " + pluginInfo.version + " by " + pluginInfo.author): log.log("Plugins(Y2TB)", "Loaded plugin: " + pluginInfo.pluginName + " " + pluginInfo.version + " by " + pluginInfo.author)
	}
	catch (err) {
		log.err("Plugins(Y2TB)", "Can't load \"" + file + "\" with error: " + err);
		!global.temp.loadPlugin.stderr ? global.temp.loadPlugin.stderr = []:"";
		global.temp.loadPlugin.stderr.push({
			plugin: file,
			error: err
		})
	}
}

function installmd(file, pluginInfo) {
	if (typeof pluginInfo.nodeDepends == "object") {
		for (var i in pluginInfo.nodeDepends) {
			/*var ch = true;
            try{
                var a = require(i)
            }catch (e){
                console.log(e)
                ch = false
            }*/

			//if (!ch) {
			if (!fs.existsSync(path.join(__dirname, "..", "..", "node_modules", i, "package.json"))) {

				log.warn("Plugins(Y2TB)", "Installing Node_module \"" + i + "\" for plugin \"" + pluginInfo.pluginName + "\":\n");
				if (pluginInfo.nodeDepends[i] != "") {
					cmd.execSync(`npm install --save ${i}@${pluginInfo.nodeDepends[i]}`, {
						stdio: "inherit",
						env: process.env,
						shell: true
					})
				} else {
					cmd.execSync(`npm install --save ${i}`, {
						stdio: "inherit",
						env: process.env,
						shell: true
					})
				}
			}
		}
	}
}

async function getFileContent(linkDir) {
	try {
		const response = await octokit.repos.getContent({
			owner: "VangBanLaNhat",
			repo: "Y2TB-data",
			path: "PluginStorage/" + linkDir,
			ref: "main"
		});
		const content = Buffer.from(response.data.content, 'base64').toString();
		//console.log(requireFromString(content, { globals: { global } }).init());
		//console.log(response.data);
		return content;
	} catch (error) {
		//console.log(error);
		try{
			let cnt = (await axios.get('https://raw.githubusercontent.com/VangBanLaNhat/Y2TB-data/main/PluginStorage/'+ linkDir)).data;
			return cnt;
		} catch (e){
			return false;
		}
	}
}

async function downloadfile(linkDir) {
	const response = await octokit.repos.getContent({
		owner: "VangBanLaNhat",
		repo: "Y2TB-data",
		path: "PluginStorage/obb/" + linkDir,
		ref: "main"
	});
	//const content = Buffer.from(response.data.content, 'base64').toString();

	let url = response.data.download_url;
	let name = path.join(__dirname, "..", "..", "plugins", "obb", response.data.name);
	try {
		const response = await axios({
			method: 'get',
			url: url,
			responseType: 'stream'
		});
		const writer = fs.createWriteStream(name);
		response.data.pipe(writer);
		await new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
		//console.log('File has been downloaded successfully');
	} catch (error) {
		console.error(error);
	}
}

function evelStringSync(str, fileName, dev) {
	fileName = fileName ? fileName:(new Date()).getTime() + "";
	
	if (dev) return (require (path.join(__dirname, "..", "..", "plugins", fileName)));
	//console.log(fileName)
	let nameEnc = (enc.base64.encode(fileName))+".js";
	//console.log(nameEnc)
	ensureExists(path.join(__dirname, "..", "..", "plugins"))
	let linkDir = path.join(__dirname, "..", "..", "plugins", nameEnc);
	
	fs.writeFileSync(linkDir, str);
	let res = (require(linkDir));
	fs.unlinkSync(linkDir);
	return res;
}

function streamToString(stream) {
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
			files.forEach(function (filename) {
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