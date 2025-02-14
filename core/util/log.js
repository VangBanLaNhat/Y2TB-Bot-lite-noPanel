var lx = require("luxon");
const fs = require("fs");
const path = require("path");
var readline = require("readline");

/*!global.logLast ? global.logLast = {
  year: 2021,
  month: 1,
  days: 1,
  loadTimes: 0
} : "";*/
function log(...msg){
    if(msg.length > 1){
		if(msg[0] == ""){
			Class = "Manager";
		}
		else {
			Class = msg[0];
		}
	}
	else {
		Class = "Manager";
		msg.push(msg[0]);
	}
    Class= "["+Class+"]";
    msg[0]="";
    var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
    
	var cl = `\x1b[38;5;195m`;
    var clcs = "\x1b[36m"; //Color is Blue
	let icon = `[ 🔔 ] `;
    var x = [`${cl}[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

	console.Log.apply(console, x.concat([icon]).concat([clcs]).concat([Class]).concat([cl]).concat(msg).concat([cl]));
	try{
		if(global.coreconfig.main_bot.toggleLog){
			var y = [`[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

			let mg = typeof msg[i] == "object"?JSON.stringify(msg[i], null, 4):msg[i];
			var str = y.concat([Class]).concat(mg).join(" ");
			fs.writeFileSync(path.join(__dirname, "..", "..", "logs", global.logStart+".txt"), str+"\n", {mode: 0o666, flag: "a"});
		}
	}catch(err){}
}

function err(...msg){
	if(msg.length > 1){
		if(msg[0] == ""){
			Class = "Manager";
		}
		else {
			Class = msg[0];
		}
	}
	else {
		Class = "Manager";
		msg.push(msg[0]);
	}
    Class= "["+Class+"]";
    msg[0]="";
    var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
    
	var cl = `\x1b[38;5;195m`;
    var clcs = "\x1b[36m"; //Color is Blue
	let icon = `[ ❌ ] `;
    var x = [`${cl}[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

	console.Log.apply(console, x.concat([icon]).concat([clcs]).concat([Class]).concat([cl]).concat(msg).concat([cl]));
	try{
		if(global.coreconfig.main_bot.toggleLog){
			var y = [`[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

			let mg = typeof msg[i] == "object"?JSON.stringify(msg[i], null, 4):msg[i];
			var str = y.concat([Class]).concat(["[ERR!]"]).concat(mg).join(" ");
			fs.writeFileSync(path.join(__dirname, "..", "..", "logs", global.logStart+".txt"), str+"\n", {mode: 0o666, flag: "a"});
		}
	}catch(err){}
}

function warn(...msg){
    if(msg.length > 1){
		if(msg[0] == ""){
			Class = "Manager";
		}
		else {
			Class = msg[0];
		}
	}
	else {
		Class = "Manager";
		msg.push(msg[0]);
	}
    Class= "["+Class+"]";
    msg[0]="";
    var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
    
	var cl = `\x1b[38;5;195m`;
    var clcs = "\x1b[36m"; //Color is Blue
	let icon = "[ ⚠️ ] ";
    var x = [`${cl}[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

	console.Log.apply(console, x.concat([icon]).concat([clcs]).concat([Class]).concat([cl]).concat(msg).concat([cl]));
	try{
		if(global.coreconfig.main_bot.toggleLog){
			var y = [`[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

			let mg = typeof msg[i] == "object"?JSON.stringify(msg[i], null, 4):msg[i];
			var str = y.concat([Class]).concat(["[WARN!]"]).concat(mg).join(" ");
			fs.writeFileSync(path.join(__dirname, "..", "..", "logs", global.logStart+".txt"), str+"\n", {mode: 0o666, flag: "a"});
		}
	}catch(err){}
}
   
function blank(){
	console.Log("\r");
}

function sync(){
	console.Log = console.log;
	console.log = log;
	console.error = err;
	console.warn = warn;
	console.blank = blank;
}

module.exports = {
    log,
    err,
	warn,
	blank,
	sync
}