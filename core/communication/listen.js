const fs = require("fs");
const path = require("path");
const process = require("process");
const log = require(path.join(__dirname, "..", "util", "log.js"));

var langMap = {
    "exitCM": {
        "desc": "Exit command",
        "vi_VN": "Lệnh không tồn tại! Vui lòng sử dụng lệnh \"{0}help [Trang số]\" để xem các lệnh hiện có",
        "en_US": "Command does not exist!  Please use the command \"{0}help [Page Number]\" to view the available commands",
        "args": {
            "{0}": {
                "vi_VN": "Prefix",
                "en_US": "Prefix"
            }
        }
    }
}

async function listen(err, event, api) {
    if (!event) return;
    if (!event.threadID || !event.senderID) return;
    api.markAsRead(event.threadID, (err) => {
        if (err) log.err(err);
    });

    switch (event.type) {
        case "message":
            if (event.attachments.length != 0) {
                log.log("Message", event);
            }
            else {
                log.log("Message", `[${event.senderID} to ${event.threadID}] ${event.body}`);
            }
            break;
        default:
            if (global.coreconfig.main_bot.toggleDebug == true) {
                log.log(event.type, event);
            }
            else if (event.type == "message_reply" && event.senderID != undefined && event.messageReply) {

                log.log("Message", `[${event.senderID} reply ${event.messageReply.senderID} to ${event.threadID}] ${event.body}`);
            }
            break;
    }

    addLang();
    if (checkList(event.senderID, event.threadID)) mess(event, api);
}

async function mess(event, api) {
    //Running Chathook...
    chathook(event, api);
    //Running Command...
    if (event.body != undefined && event.body.slice(0, global.config.facebook.prefix.length) == global.config.facebook.prefix) {
        var cml = event.body.slice(global.config.facebook.prefix.length, event.body.length);
        var ms = cml.split(" ");
        var check = false;
        for (var i in global.plugins) {
            if (global.plugins[i].command[ms[0]] != undefined) {
                event.args = event.body;
                event.args = event.args.split(" ");

                event.body = event.body.split(" ");
                event.body.splice(0, 1);
                event.body = event.body.join(" ");

                try {
                    let name = global.plugins[i].command[ms[0]].namePlugin;
                    let mainFunc = global.plugins[i].plugins[name].fullFunc;
                    let func = global.plugins[i].command[ms[0]].mainFunc;
                    
                    await mainFunc[func](event, api);
                }
                catch (err) {
                    log.err(global.plugins[i].command[ms[0]].namePlugin, err)
                    api.sendMessage(err, event.threadID, event.messageID);
                }

                check = true;
                break;
            }
        }
        if (!check) {
            var rt = global.lang.listen.exitCM[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix)
            api.sendMessage(rt, event.threadID, event.messageID);
        }
    }
}

async function chathook(event, api) {
    try {
        event.args = event.body;
        event.args = event.args.split(" ");
    } catch (_) { }
    for (var i in global.chathook) {
        try {
        	let name = global.chathook[i].main;
            let mainFunc = global.plugins.VBLN.plugins[name].fullFunc
            var func = global.chathook[i].func;
            
            mainFunc[func](event, api);
        }
        catch (err) {
            log.err(i, err);
        }
    }
}

function checkList(uid, tid) {
    if (global.config.facebook.UIDmode == "blackList") {
        if (global.config.facebook.blackList.indexOf(uid) == -1 && global.config.facebook.blackList.indexOf(tid) == -1) return true;
        return false;
    };
    if (global.config.facebook.UIDmode == "whiteList") {
        if (global.config.facebook.whiteList.indexOf(tid) != -1) return true;
        if (global.config.facebook.whiteList.indexOf(uid) != -1) return true;
        return false;
    };
    return true;
}

function addLang() {
    !global.lang.listen ? global.lang.listen = langMap : ""
    if (!fs.existsSync(path.join(__dirname, "..", "..", "lang", `listen.json`))) {
        fs.writeFileSync(path.join(__dirname, "..", "..", "lang", `listen.json`), JSON.stringify(langMap, null, 4), { mode: 0o666 });
    }
}

module.exports = listen;
