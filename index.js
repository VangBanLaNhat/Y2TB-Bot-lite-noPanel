//require stuffs
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");
const readline = require("readline");
var lx = require("luxon");
var log = require("./core/util/log.js");
var scanDir = require("./core/util/scanDir.js");
console.logg = console.log;
console.log = log.log;
console.error = log.err;
console.warn = log.warn;
console.blank = log.blank;

//Write log
var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
ensureExists(path.join(__dirname, "logs"));
global.logStart = `${dt.day}D${dt.month}M${dt.year}Y.T${dt.hour}H${dt.minute}M${dt.second}S`;
var ll = scanDir(".txt", path.join(__dirname, "logs"));
for (var i=0; i<ll.length; i++){
    var lll = ll[i].slice(0,2);
    lll = lll.replace("D","");
    if(dt.day.toString() != lll){
        fs.unlinkSync(path.join(__dirname, "logs", ll[i]));
    }
}

//config loader



//let glb = JSON.stringify(global);

/*setInterval(function(){
    require("./core/util/global.js")();
}, 1*60*60*1000)*/
async function start (){
	globalC = {};
	globalC.data = global.data;
	log.blank();
	log.log("Config", "Loading config...");
	try{
		global.config = require("./core/util/getConfig.js").getConfig();
		global.coreconfig = require("./core/util/getConfig.js").getCoreConfig();
		log.log("Config", "Loading config success!");
		log.blank();
	}
	catch(err){
		log.log(err);
	    log.err("Config", "Can't load Config. Existing...");
		log.blank();
	    process.exit(101);
	}


	//data loader
	log.log("Data", "Loading data...");
	try{
	    require("./core/util/getData.js").getdt();
	    //require("./core/util/getData.js").getprdt();
	    log.log("Data", "Loading data success!");
	}
	catch(err){
	    log.log(err);
	    log.err("Data", "Can't load Data. Existing...");
		log.blank();
	    process.exit(102);
	}
	setInterval(function(){
	    try{
	        fs.writeFileSync(path.join(__dirname, "data", "data.json"), JSON.stringify(globalC.data, null, 4), {mode: 0o666});
	        //fs.writeFileSync(path.join(__dirname, "data", "prdata.json"), JSON.stringify(global.prdata, null, 4), {mode: 0o666});
	    }
	    catch(err){
	        log.err("Data", "Can't auto save data with error: "+err);
	    }
	}, global.coreconfig.main_bot.dataSaveTime*1000)


	for(let i in global){
	    if(i != "global" && i != "plugins"){
	        globalC[i] = global[i];
	    } else if(i == "plugins"){
	    	globalC[i] = JSON.parse(JSON.stringify(global[i]))
	    }

	}

	//loadPlugins
	log.log("Plugin", "Loading Plugins...")
	try{
	    ensureExists(path.join(__dirname, "lang"));
	    await require("./core/util/loadPlugin.js")();
	    for(let i in global){
	    	if(i != "global" && i != "plugins"){
	        globalC[i] = global[i];
	    } else if(i == "plugins"){
	    	globalC[i] = JSON.parse(JSON.stringify(global[i]))
	    }
		}
		for(let i in globalC.plugins.VBLN.command){
	    	delete globalC.plugins.VBLN.command[i].main;
		}
	}
	catch(err){
	    log.err("Plugins", "Can't load plugins with error: "+err);
	}


	//loadLang
	log.log("Languages", "Loading Languages...");
	require("./core/util/loadLang.js")();

	for(let i in global){
	    	if(i != "global" && i != "plugins"){
	        globalC[i] = global[i];
	    }
	}

	//credentials loader
	let fbCredentials = {
	    email: global.config.facebook.FBemail,
	    password: global.config.facebook.FBpassword
	}
	log.log("Manager", "Loading User-credentials...");
	//log.log("Manager", `Appstate: ${(fs.existsSync(path.join(__dirname, "udata", "fbstate.json"))) ? "Yes" : "No"}`, `Email: ${(fbCredentials.email == "") ? `""` : fbCredentials.email}`, `Password: ${(fbCredentials.password == "") ? `""` : fbCredentials.password}`);
	fs.existsSync(path.join(__dirname, "udata", "fbstate.json")) ? log.log("Manager", `=> Login account using FBstate`) : ((fbCredentials.email == "" && fbCredentials.password == "") ? log.err("Manager", "=> No FBstate and FBCredentials blank ", "=> Unable to login!") : log.log("Manager", `=> Login account using FBCredentials`))
	log.blank();

	//login facebook!!!

	var loginstate;
	(!(fs.existsSync(path.join(__dirname, "udata", "fbstate.json"))) && fbCredentials.email == "" && fbCredentials.password == "") ? loginstate = false : loginstate = true
	if(loginstate){
		let loginOptions = {
			"logLevel": global.coreconfig.facebook.logLevel,
			"userAgent": global.coreconfig.facebook.userAgent,
			"selfListen": global.config.facebook.selfListen,
			"listenEvents": global.coreconfig.facebook.listenEvents,
			"updatePresence": global.coreconfig.facebook.updatePresence,
			"autoMarkRead": global.config.facebook.autoMarkRead
		}
		log.log("Manager", "Logging...")
		let appStatePath = path.join(__dirname, "udata", "fbstate.json");
		let appState = {};
		if (fs.existsSync(appStatePath)) {
			//login using appstate
			appState = JSON.parse(fs.readFileSync(appStatePath, "utf-8"));
			await require("./core/communication/fb.js")(appState, loginOptions);
		} else {
			//login using credentials then create appstate
			log.log("Manager", "Creating appstate for further login...");
			var rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			login(fbCredentials, loginOptions, (err, api) => {
				log.log(err);
				if (err) {
					switch (err.error) {
						case 'login-approval':
							log.log("Login","Account detected with 2-step verification (2-FA) enabled\nPlease enter verification code to continue");
							rl.question("Verification code: ", (code) => {
								err.continue(code);
								rl.close();
							});
							break;
						default:
							log.err("login" ,err);
					}
					return;
				}

				appState = api.getAppState();
				require("./core/communication/fb.js")(appState, loginOptions);
				fs.writeFileSync(appStatePath, JSON.stringify(appState, null, "\t"));
			});
		}
	}
}

start();

//process.on("message", (a)=>{console.log(a)});

process.on('exit', function(code) {
	try{
	    fs.writeFileSync(path.join(__dirname, "data", "data.json"), JSON.stringify(globalC.data, null, 4), {mode: 0o666});
	    console.log("Data", "Saved data!")
	    //fs.writeFileSync(path.join(__dirname, "data", "prdata.json"), JSON.stringify(global.prdata, null, 4), {mode: 0o666});
	}
	catch(err){
	    log.err("Data", "Can't auto save data with error: "+err);
	}
});

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