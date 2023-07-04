const fs = require("fs");
const path = require("path");
const process = require("process");
const log = require(path.join(__dirname, "..", "util", "log.js"));

async function listen(err, event, api) {
    if (!event) return;
    if (!event.threadID && !event.senderID) return;
    api.markAsRead(event.threadID, (err) => {
        if (err) log.err(err);
    });

    switch (event.type) {
        case "message":
        	if(global.threadInfo[event.threadID]) global.threadInfo[event.threadID].messageCount++;
            if (event.attachments.length != 0) {
            	let temp = event;
            	delete temp.participantIDs;
                log.log("Message", temp);
            }
            else {
                log.log("Message", `[${event.senderID} to ${event.threadID}] ${event.body}`);
            }
            break;
        default:
        	listenEvent(event);
            if (global.coreconfig.main_bot.toggleDebug == true) {
                log.log(event.type, event);
            }
            else if (event.type == "message_reply" && event.senderID != undefined && event.messageReply) {
                log.log("Message", `[${event.senderID} reply ${event.messageReply.senderID} to ${event.threadID}] ${event.body}`);
            }
            break;
    }

    if (checkList(event.senderID, event.threadID)) mess(event, api);
}

async function mess(event, api) {
	//Convert necessary function
	eval(strFunc);
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
                    
                    let adv = {
                    	pluginName: name,
                    	lang: global.lang[name],
                    	rlang: (inp)=>{
                    		return global.lang[name][inp][global.config.bot_info.lang];
                    	},
                    	iso639: global.config.bot_info.lang,
                    	config: global.configPl[name],
                    	replaceMap,
                    	getUserInfo,
                    	getThreadInfo
                    };
                    
                    await mainFunc[func](event, api, adv);
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
        	let rt = "Please install the “Help” plugin to see the available commands!"
        	if(global.lang["Help"]) rt = global.lang["Help"].exitCM[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix)
            api.sendMessage(rt, event.threadID, event.messageID);
        }
    }
    
}

async function chathook(event, api) {
	eval(strFunc);
    try {
        event.args = event.body;
        event.args = event.args.split(" ");
    } catch (_) { }
    for (var i in global.chathook) {
        try {
        	let name = global.chathook[i].main;
            let mainFunc = global.plugins.Y2TB.plugins[name].fullFunc
            var func = global.chathook[i].func;
            
            let adv = {
            	pluginName: name,
            	lang: global.lang[name],
            	rlang: (inp)=>{
            		return global.lang[name][inp][global.config.bot_info.lang];
            	},
            	iso639: global.config.bot_info.lang,
            	config: global.configPl[name],
            	replaceMap: replaceMap,
            	getUserInfo,
            	getThreadInfo
            };
            
            mainFunc[func](event, api, adv);
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

function listenEvent(event){
	if(event.type == "message_reply" && global.threadInfo[event.threadID]) return global.threadInfo[event.threadID].messageCount++;
	if(event.type == "change_thread_image" && global.threadInfo[event.threadID]) return global.threadInfo[event.threadID].imageSrc = event.image.url;
	switch (event.logMessageType) {
		case 'log:unsubscribe':
			global.threadInfo[event.threadID] ? global.threadInfo[event.threadID].participantIDs = event.participantIDs:"";
			if(global.threadInfo[event.threadID]) for(let i in global.threadInfo[event.threadID].adminIDs)
				if(global.threadInfo[event.threadID].adminIDs[i].id == event.logMessageData.leftParticipantFbId) global.threadInfo[event.threadID].adminIDs.splice(i, 1);
			break;
		
		case 'log:subscribe':
			//console.log(event.logMessageData.addedParticipants);
			global.threadInfo[event.threadID] ? global.threadInfo[event.threadID].participantIDs = event.participantIDs:"";
			break;
		case 'change_thread_admins':
			if(!global.threadInfo[event.threadID]) break;
			if(event.logMessageData.ADMIN_EVENT == "remove_admin"){
				for(let i in global.threadInfo[event.threadID].adminIDs)
					if(global.threadInfo[event.threadID].adminIDs[i].id == event.logMessageData.TARGET_ID) global.threadInfo[event.threadID].adminIDs.splice(i, 1);
			}else{
				global.threadInfo[event.threadID].adminIDs.push({id: event.logMessageData.TARGET_ID})
			}
			break;
		case 'log:thread-name':
			if(!global.threadInfo[event.threadID]) break;
			global.threadInfo[event.threadID].name = global.threadInfo[event.threadID].threadName = event.logMessageData.name;
			break;
		case 'log:user-nickname':
			if(!global.threadInfo[event.threadID]) break;
			if(event.logMessageData.nickname != '') global.threadInfo[event.threadID].nicknames[event.logMessageData.participant_id] = event.logMessageData.nickname;
			else delete global.threadInfo[event.threadID].nicknames[event.logMessageData.participant_id]
			break;
		case 'log:thread-color':
			if(!global.threadInfo[event.threadID]) break;
			global.threadInfo[event.threadID].color = event.logMessageData.theme_color.replace("FF", "");
			if(event.logMessageData.theme_emoji) global.threadInfo[event.threadID].emoji = event.logMessageData.theme_emoji;
			break;
	}
}

function replaceMap(str, map){
 str = str+"";
	for(let i in map)
		str = str.replaceAll(i, map[i]);
	return str;
}

const strFunc = `async function getUserInfo(uid, callback){
		if(global.userInfo[uid]){
			if(callback) return callback(undefined, global.userInfo[uid]);
			return global.userInfo[uid];
		}
		if(uid != event.senderID || !event.isGroup){
			try {
				var UI = (await api.getUserInfo(uid))[uid];
			}catch(e){
				if(callback) return callback(e);
				throw new Error(e);
			}
			global.userInfo[uid] = Object.assign({}, UI);
			let time = new Date();
			global.userInfo[uid].timestamp = time.getTime();
		} else {
			try {
				var threadInfo = await api.getThreadInfo(event.threadID);
			}catch(e){
				if(callback) return callback(e);
				throw new Error(e);
			}
			for(let user of threadInfo.userInfo){
				global.userInfo[user.id] = user;
				let time = new Date();
				global.userInfo[user.id].timestamp  = time.getTime();
			}
			global.threadInfo[threadInfo.threadID] = threadInfo;
			delete global.threadInfo[threadInfo.threadID].userInfo;
		}
		if(callback) return callback(undefined, global.userInfo[uid]);
		return global.userInfo[uid];
	}
	async function getThreadInfo(tid, callback){
		if(!global.threadInfo[tid]){
			try {
				var threadInfo = await api.getThreadInfo(tid);
			}catch(e){
				if(callback) return callback(e);
				throw new Error(e);
			}
			for(let user of threadInfo.userInfo){
				global.userInfo[user.id] = user;
				let time = new Date();
				global.userInfo[user.id].timestamp  = time.getTime();
			}
			global.threadInfo[threadInfo.threadID] = threadInfo;
			delete global.threadInfo[threadInfo.threadID].userInfo;
		}
		if(callback) return callback(undefined, global.threadInfo[tid]);
		return global.threadInfo[tid];
	}
`

module.exports = listen;