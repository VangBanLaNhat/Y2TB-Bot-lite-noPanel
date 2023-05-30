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
			classs = "Manager";
		}
		else {
			classs = msg[0];
		}
	}
	else {
		classs = "Manager";
		msg.push(msg[0]);
	}
    classs= "["+classs+"]";
    msg[0]="";
    var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
    try{
		var cl = `\x1b[${global.coreconfig.main_bot.consoleColor}m`;
    }
    catch(err){
        var cl = "\x1b[32m"
    }//Color is Green
    var clcs = "\x1b[36m"; //Color is Cyan
    var x = [`${cl}[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];
	for(i=1;i<msg.length;i++){
		console.logg.apply(console, x.concat([clcs]).concat([classs]).concat([cl]).concat(msg[i]).concat([cl]));
		try{
		    if(global.coreconfig.main_bot.toggleLog){
		        var y = [`[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

		        let mg = typeof msg[i] == "object"?JSON.stringify(msg[i], null, 4):msg[i];
		        var str = y.concat([classs]).concat(mg).join(" ");
		        fs.writeFileSync(path.join(__dirname, "..", "..", "logs", global.logStart+".txt"), str+"\n", {mode: 0o666, flag: "a"});
		    }
		}catch(err){}
	}
}

function err(...msg){
	if(msg.length > 1){
		if(msg[0] == ""){
			classs = "Manager";
		}
		else {
			classs = msg[0];
		}
	}
	else {
		classs = "Manager";
		msg.push(msg[0]);
	}
    classs= "["+classs+"]";
    msg[0]="";
    var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
    //readline.cursorTo(process.stdout, 0);
    try{
		var cl = `\x1b[${global.coreconfig.main_bot.consoleColor}m`;
    }
    catch(err){
        var cl = "\x1b[32m"
    } //Color is Green
    var clcs = "\x1b[36m"; //Color is Cyan
    var clerr = "\x1b[31m" //Color is Red
    var clwa = "\x1b[33m"; //Color is Yellow
    var x = [`${cl}[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];
	for(i=1;i<msg.length;i++){
		console.logg.apply(console, x.concat([clcs]).concat([classs]).concat([clerr]).concat(["[ERR!]"]).concat([clwa]).concat(msg[i]).concat([cl]));
		try{
		    if(global.coreconfig.main_bot.toggleLog){
		        var y = [`[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

		        let mg = typeof msg[i] == "object"?JSON.stringify(msg[i], null, 4):msg[i];
		        var str = y.concat([classs]).concat(["[ERR!]"]).concat(mg).join(" ");
		        fs.writeFileSync(path.join(__dirname, "..", "..", "logs", global.logStart+".txt"), str+"\n", {mode: 0o666, flag: "a"});
		    }
		}catch(err){}
	}
}

function warn(...msg){
    if(msg.length > 1){
		if(msg[0] == ""){
			classs = "Manager";
		}
		else {
			classs = msg[0];
		}
	}
	else {
		classs = "Manager";
		msg.push(msg[0]);
	}
    if (classs=='') classs="Manager";
    classs= "["+classs+"]";
    msg[0]="";
    var dt = lx.DateTime.now().setZone("Asia/Ho_Chi_Minh");
    //readline.cursorTo(process.stdout, 0);
    try{
    var cl = `\x1b[${global.coreconfig.main_bot.consoleColor}m`;
    }
    catch(err){
        var cl = "\x1b[32m"
    } //Color is Green
    var clcs = "\x1b[36m"; //Color is Cyan
    var clwarn = "\x1b[33m" //Color is Red
    var clwa = "\x1b[37m"; //Color is Yellow
    var x = [`${cl}[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];
	for(i=1;i<msg.length;i++){
		console.logg.apply(console, x.concat([clcs]).concat([classs]).concat([clwarn]).concat(["[WARN!]"]).concat([clwa]).concat(msg));
		try{
		    if(global.coreconfig.main_bot.toggleLog){
		        var y = [`[${dt.day}.${dt.month}T${dt.hour}.${dt.minute}.${dt.second}Z]`];

		        let mg = typeof msg[i] == "object"?JSON.stringify(msg[i], null, 4):msg[i];
		        var str = y.concat([classs]).concat(["[WARN!]"]).concat(mg).join(" ");
		        fs.writeFileSync(path.join(__dirname, "..", "..", "logs", global.logStart+".txt"), str+"\n", {mode: 0o666, flag: "a"});
		    }
	    }catch(err){}
	}
}
   
function blank(){
	console.logg("\r");
}

function sync(){
	console.logg = console.log;
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