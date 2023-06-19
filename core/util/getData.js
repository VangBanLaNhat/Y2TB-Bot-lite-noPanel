const fs = require("fs");
const path = require("path");
var stripBom = require("strip-bom");
var log = require("./log.js");

function getdt(){
    var check = true;
    try {
        var t = fs.readFileSync(path.join(__dirname, "..", "..", "data", "data.json"), {encoding: "utf8"})
    } catch (err) {check=false}
    if (check == false){
        ensureExists(path.join(__dirname, "..", "..", "data"));
        log.warn("Data", "Data file not found. Creating a default one...");
        try {
            var df = {};
            fs.writeFileSync(path.join(__dirname, "..", "..", "data", "data.json"), JSON.stringify(df, null, 4), {mode: 0o666});
            global.data = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "..", "..", "data", "data.json"), {encoding: "utf8"})));
        }
        catch (err) {
            log.err("Data", `Cannot write data, returned an error: ${err}`, "Existing...");
            process.exit(102);
        }
    }
    else{
        global.data = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "..", "..", "data", "data.json"), {encoding: "utf8"})));
    }
}

function getprdt(){
    var check = true;
    try {
        var t = fs.readFileSync(path.join(__dirname, "..", "..", "data", "prdata.json"), {encoding: "utf8"})
    } catch (err) {check=false}
    if (check == false){
        try {
            ensureExists(path.join(__dirname, "..", "..", "data"));
            var df = {};
            fs.writeFileSync(path.join(__dirname, "..", "..", "data", "prdata.json"), JSON.stringify(df, null, 4), {mode: 0o666});
            global.prdata = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "..", "..", "data", "prdata.json"), {encoding: "utf8"})));
        }
        catch (err) {
            log.err("Data", `Cannot write data, returned an error: ${err}`, "Existing...");
            process.exit(102);
        }
    }
    else{
        global.prdata = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "..", "..", "data", "prdata.json"), {encoding: "utf8"})));
    }
}

function getUser(){
	if(!fs.existsSync(path.join(__dirname, "..", "..", "data", "user.json"))){
		try {
            ensureExists(path.join(__dirname, "..", "..", "data"));
            
            fs.writeFileSync(path.join(__dirname, "..", "..", "data", "user.json"), JSON.stringify({}, null, 4), {mode: 0o666});
            global.userInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "data", "user.json"), {encoding: "utf8"}));
        }
        catch (err) {
            log.err("Data", `Cannot write data, returned an error: ${err}`, "Existing...");
            process.exit(102);
        }
	} else global.userInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "data", "user.json"), {encoding: "utf8"}));
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
module.exports = {
    getdt,
    getprdt,
    getUser
}