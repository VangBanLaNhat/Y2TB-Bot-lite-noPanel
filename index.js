//Require stuffs

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const login = require("fca-unofficial");
const readline = require("readline");
const axios = require("axios");
const AdmZip = require("adm-zip");
const cmd = require('child_process');
var lx = require("luxon");
var log = require("./core/util/log.js"); log.sync();
var scanDir = require("./core/util/scanDir.js");

//Write logs

var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
ensureExists(path.join(__dirname, "logs"));
global.logStart = `${dt.day}D${dt.month}M${dt.year}Y.T${dt.hour}H${dt.minute}M${dt.second}S`;
var ll = scanDir(".txt", path.join(__dirname, "logs"));
for (var i = 0; i < ll.length; i++) {
	var lll = ll[i].slice(0, 2);
	lll = lll.replace("D", "");
	if (dt.day.toString() != lll) {
		fs.unlinkSync(path.join(__dirname, "logs", ll[i]));
	}
}

//Main function

(async () => {

	//Main update
	console.log("Update", "Checking update...");
	let vern = (JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")))).version;
	try {
		var verg = (await axios.get('https://raw.githubusercontent.com/VangBanLaNhat/Y2TB-Bot-lite-noPanel/main/package.json')).data.version;
	} catch (e) {
		console.error("Update", e, "Failed to connect to to the server!");
		process.exit(504);
	}

	if (fs.existsSync(path.join(__dirname, "update"))) {
		console.warn("Update", "Proceed to update node_modules...")
		deleteFolderRecursive(path.join(__dirname, "update"));
		if(!fs.existsSync(path.join(__dirname, "data", "user.json"))){
			let listModule = (JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")))).dependencies;
			let listInstall = "";
			for(let i in listModule){
				listInstall += " " + i;
				listModule[i].indexOf("^") != -1 ? listInstall+="@"+listModule[i]:"";
			}
			cmd.execSync(`npm install`+listInstall, {
				stdio: "inherit",
				env: process.env,
				shell: true
			})
			console.log("Update", "Complete update. Proceed to restart...");
			process.exit(7378278);
		}
	}

	if (vern != verg) {
		console.warn("Update", "The new update has been discovered. Proceed to download the imported version...");
		let pathFile = path.join(__dirname, "update");
		try {
			await downloadUpdate(pathFile);
			console.log("Update", 'Download the update completed!');
		} catch (error) {
			console.error("Update", 'Error generation during the download process: ' + error);
			process.exit(504);
		}

		try {
			await extractZip(path.join(pathFile, "update.zip"), pathFile);
			fs.unlinkSync(path.join(pathFile, "update.zip"));
			console.log("Update", 'Extraction completed!');
		} catch (error) {
			fs.unlinkSync(path.join(pathFile, "update.zip"));
			console.error("Update", error);
			process.exit(504);
		}

		let minus = ["tool", "plugins"];

		let listFile = fs.readdirSync(path.join(pathFile, "Y2TB-Bot-lite-noPanel-main"));
		// delete require.cache[require.resolve("./core/util/log.js")];
		// delete require.cache[require.resolve("./core/util/scanDir.js")]
		for (let i of listFile)
			if (minus.indexOf(i) == -1) {
				if (!fs.lstatSync(path.join(pathFile, "Y2TB-Bot-lite-noPanel-main", i)).isFile()) copyFolder(path.join(pathFile, "Y2TB-Bot-lite-noPanel-main", i), path.join(pathFile, "..", i));
				else fs.renameSync(path.join(pathFile, "Y2TB-Bot-lite-noPanel-main", i), path.join(pathFile, "..", i));
			}
		console.log("Update", "Complete update. Proceed to restart...");
		process.exit(7378278);

	} else console.log("Update", "Awesome, you're on the latest version!");

	//globalC = Object.assign({}, global);
	log.blank();
	log.log("Config", "Loading config...");
	try {
		global.config = require("./core/util/getConfig.js").getConfig();
		global.coreconfig = require("./core/util/getConfig.js").getCoreConfig();
		log.log("Config", "Loading config success!");
		log.blank();
	}
	catch (err) {
		log.log(err);
		log.err("Config", "Can't load Config. Existing...");
		log.blank();
		process.exit(101);
	}

	//data loader

	log.log("Data", "Loading data...");
	try {
		require("./core/util/getData.js").getdt();
		require("./core/util/getData.js").getUser();
		global.threadInfo = {};
		log.log("Data", "Loading data success!");
	}
	catch (err) {
		log.log(err);
		log.err("Data", "Can't load Data. Existing...");
		log.blank();
		process.exit(102);
	}
	setInterval(function () {
		try {
			fs.writeFileSync(path.join(__dirname, "data", "data.json"), JSON.stringify(global.data, null, 4), { mode: 0o666 });
			fs.writeFileSync(path.join(__dirname, "data", "user.json"), JSON.stringify(global.userInfo, null, 4), { mode: 0o666 });
		}
		catch (err) {
			if (err != 'TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined') log.err("Data", "Can't auto save data with error: " + err);
		}
	}, global.coreconfig.main_bot.dataSaveTime * 1000)

	//loadPlugins

	log.log("Plugin", "Loading Plugins...")
	try {
		ensureExists(path.join(__dirname, "lang"));
		await require("./core/util/loadPlugin.js")();
	}
	catch (err) {
		log.err("Plugins", "Can't load plugins with error: " + err);
	}

	//loadLang

	log.log("Languages", "Loading Languages...");
	require("./core/util/loadLang.js")();

	//Load Config of plugins

	log.log("Config", "Loading config for plugins...");
	require("./core/util/loadConfig.js")();

	//credentials loader

	let fbCredentials = {
		email: global.config.facebook.FBemail,
		password: global.config.facebook.FBpassword
	}
	log.log("Manager", "Loading User-credentials...");
	fs.existsSync(path.join(__dirname, "udata", "fbstate.json")) ? log.log("Facebook", `=> Login account using FBstate`) : ((fbCredentials.email == "" && fbCredentials.password == "") ? log.err("Facebook", "=> No FBstate and FBCredentials blank ", "=> Unable to login!") : log.log("Facebook", `=> Login account using FBCredentials`))
	log.blank();

	//login facebook!!!

	var loginstate;
	(!(fs.existsSync(path.join(__dirname, "udata", "fbstate.json"))) && fbCredentials.email == "" && fbCredentials.password == "") ? loginstate = false : loginstate = true
	if (loginstate) {
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
							log.log("Login", "Account detected with 2-step verification (2-FA) enabled\nPlease enter verification code to continue");
							rl.question("Verification code: ", (code) => {
								err.continue(code);
								rl.close();
							});
							break;
						default:
							log.err("login", err);
					}
					return;
				}

				appState = api.getAppState();
				require("./core/communication/fb.js")(appState, loginOptions);
				fs.writeFileSync(appStatePath, JSON.stringify(appState, null, "\t"));
			});
		}
	}
})();

process.on('exit', function (code) {
	try {
		fs.writeFileSync(path.join(__dirname, "data", "data.json"), JSON.stringify(global.data, null, 4), { mode: 0o666 });
		fs.writeFileSync(path.join(__dirname, "data", "user.json"), JSON.stringify(global.userInfo, null, 4), { mode: 0o666 });
		console.log("Data", "Saved data!")
		//fs.writeFileSync(path.join(__dirname, "data", "prdata.json"), JSON.stringify(global.prdata, null, 4), {mode: 0o666});
	}
	catch (err) {
		if (err != 'TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined') log.err("Data", "Can't auto save data with error: " + err);
	}
});

async function downloadUpdate(pathFile) {
	let url = 'https://github.com/VangBanLaNhat/Y2TB-Bot-lite-noPanel/archive/refs/heads/main.zip';

	ensureExists(pathFile);

	try {
		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream'
		});

		const writer = fs.createWriteStream(path.join(pathFile, "update.zip"));

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
		});
	} catch (error) {
		console.error("Update", 'Error downloading file: ' + error);
		process.exit(504);
	}
}

function extractZip(filePath, destinationPath) {
	return new Promise((resolve, reject) => {
		const zip = new AdmZip(filePath);
		zip.extractAllToAsync(destinationPath, true, (error) => {
			if (error) {
				console.error('Error extracting zip file:', error);
				reject(error);
				process.exit(504);
			} else {
				resolve();
			}
		});
	});
}

function copyFolder(sourcePath, destinationPath) {
	try {
		ensureExists(destinationPath);

		const files = fs.readdirSync(sourcePath);

		files.forEach((file) => {
			const sourceFile = path.join(sourcePath, file);
			const destinationFile = path.join(destinationPath, file);

			if (fs.lstatSync(sourceFile).isFile()) {
				fs.copyFileSync(sourceFile, destinationFile);
			} else {
				copyFolder(sourceFile, destinationFile);
			}
		});

	} catch (error) {
		console.error("Update", 'Error copying folder: ' + error);
	}
}

function deleteFolderRecursive(folderPath) {
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file) => {
			const curPath = folderPath + '/' + file;

			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});

		fs.rmdirSync(folderPath);
	} else {
		console.log('Folder does not exist.');
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