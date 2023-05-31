function init(){
    return{
        "pluginName": "DevTool",
        "pluginMain": "devtool.js",
        "commandList": {
			"devupload": {
                "help": {
                    "vi_VN": "<username> <password> <plugin name>",
                    "en_US": "<tên tài khoản> <mật khẩu> <Tên plugin>"
                },
                "tag": {
                    "vi_VN": "Đăng ký plugin (admin only)",
                    "en_US": "Register plugin (admin only)"
                },
                "mainFunc": "devupload"
            }
        },
        "nodeDepends":{
            "axios": "",
			"form-data": "",
            "adm-zip": ""
        },
        "langMap":{
            "notInbox":{
                "desc": "lang khi bot nhận lệnh devupload mà không phải trong inbox với bot",
                "vi_VN": "Hãy sử dụng lệnh trong inbox của bot để tránh lộ thông tin đăng nhập!",
                "en_US": "Please inbox bot to use this command to avoid account leaks!",
                "args": {}
            },
			"notAdmin":{
                "desc": "lang khi bot nhận lệnh devupload mà không phải là admin",
                "vi_VN": "Chỉ admin bot mới có quyền sử dụng",
                "en_US": "Admin bot only",
                "args": {}
            },
            "notEnoughParams":{
                "desc": "lang khi bot nhận lệnh devupload mà không đủ tham số",
                "vi_VN": "Thiếu Tham số! hãy cung cấp đủ tên tài khoản, mật khẩu, tên file plugin theo cú pháp {0}devupload <tên tài khoản> <mật khẩu> <tên file plugin>! Nếu chưa có tài khoản hãy liên lạc với Admin Y2TB để mở tài khoản.",
                "en_US": "Not enough params! Please provide your username, password and plugin path according to the syntax {0}devupload <username> <password> <plugin path>. If you don't have an account, please talk to Y2TB Admins to register.",
                "args": {
                    "{0}": {
                        "vi_VN": "prefix của bot",
                        "en_US": "Bot prefix"
                    }
                }
            },
            "badUsername":{
                "desc": "lang khi bot nhận lệnh devlogin và tên tài khoản không tồn tại",
                "vi_VN": "Tên tài khoản không tồn tại. Nếu chưa có tài khoản hãy liên lạc với Admin Y2TB để mở tài khoản.",
                "en_US": "Username not exist! If you don't have an account, please talk to Y2TB Admins to register.",
                "args": {}
            },
            "badPassword":{
                "desc": "lang khi bot nhận lệnh devlogin và mật khẩu không đúng",
                "vi_VN": "Mật khẩu không đúng. Nếu quên mật khẩu hãy liên lạc với Admin Y2TB để thay đổi.",
                "en_US": "Incorrect password! If you forgot the password, please talk to Y2TB Admins to change.",
                "args": {}
            },
			"blankPluginPath":{
                "desc": "lang khi bot nhận lệnh devupload mà tên file plugin để trống",
                "vi_VN": "Tên file plugin không được để trống",
                "en_US": "Plugin path cannot be left blank",
                "args": {}
            },
			"pluginNotFound":{
                "desc": "lang khi bot nhận lệnh devupload mà địa chỉ plugin không tồn tại",
                "vi_VN": "Không tìm thấy plugin {0} ở folder folder_bot/plugins/",
                "en_US": "Plugin {0} not found at directory folder_bot/plugins/",
                "args": {
					"{0}": {
                        "vi_VN": "Tên plugin",
                        "en_US": "Plugin name"
                    }
				}
            },
			"requestError":{
                "desc": "lang khi bot nhận lệnh devupload mà tryền tải dữ liệu gặp lỗi",
                "vi_VN": "Đã có lỗi xảy ra khi truyền tải dữ liệu: {0}",
                "en_US": "An error occurred while transmitting data: {0}",
                "args": {
					"{0}": {
                        "vi_VN": "Tên plugin",
                        "en_US": "Plugin name"
                    }
				}
            },
			"UnknownErr":{
                "desc": "lang khi server nhận lệnh devupload mà dữ liệu tryền tải gặp lỗi",
                "vi_VN": "Đã xuất hiện lỗi bất thường khi server nhận dữ liệu. Vui lòng thử lại sau!",
                "en_US": "An error occurred while server recieving data. Please try again later.",
                "args": {}
            },
			"update?":{
                "desc": "lang khi server phát hiện plugin có tên và author giống, phiên bản khác với plugin trên database (nghi ngờ là update)",
                "vi_VN": "Phát hiện tên plugin và tác giả giống nhau với plugin trên server. Phiên bản của plugin trên server khác với phiên bản hiện tại. Nếu bạn là tác giả và muốn update plugin, hãy liên lạc với admin để trao đổi.",
                "en_US": "This plugin likely the same as plugin already have on server. That plugin's version is different from this version. If you're the author and want to update, please consider contact the admins about this.",
                "args": {}
            },
			"alreadyHave":{
                "desc": "lang khi server thấy plugin đã có trên server",
                "vi_VN": "Plugin này đã có trên server. Để biết thêm, vui lòng liên hệ admin.",
                "en_US": "This plugin is already on server database. Contact the admins to know more.",
                "args": {}
            },
			"alreadyName":{
                "desc": "lang khi server thấy tên plugin trùng với plugin đã có trên server",
                "vi_VN": "Tên plugin này đã được dùng. Vui lòng thay tên plugin khác.",
                "en_US": "This plugin name is already being used. Please consider change the plugin name.",
                "args": {}
            },
			"update?PENDING":{
                "desc": "lang khi server phát hiện plugin có tên và author giống, phiên bản khác với plugin trong danh sách đợi duyệt (nghi ngờ là update)",
                "vi_VN": "Phát hiện tên plugin và tác giả giống nhau với plugin trong danh sách đợi duyệt. Phiên bản của plugin trong danh sách đợi duyệt khác với phiên bản hiện tại. Nếu bạn là tác giả và muốn update plugin, hãy liên lạc với admin để trao đổi.",
                "en_US": "This plugin likely the same as plugin already in pending list. That plugin's version is different from this version. If you're the author and want to update, please consider contact the admins about this.",
                "args": {}
            },
			"alreadyHavePENDING":{
                "desc": "lang khi server thấy plugin đã có trên server",
                "vi_VN": "Plugin này đang trong danh sách đợi duyệt. Để biết thêm, vui lòng liên hệ admin.",
                "en_US": "This plugin is in pending list. Please consider contact the admins to know more.",
                "args": {}
            },
			"alreadyNamePENDING":{
                "desc": "lang khi server thấy tên plugin trùng với plugin trong danh sách đợi duyệt",
                "vi_VN": "Tên plugin này đã được dùng. Vui lòng thay tên plugin khác.",
                "en_US": "This plugin name is already being used. Please consider change the plugin name.",
                "args": {}
            },
			"done":{
                "desc": "lang khi upload thành công",
                "vi_VN": "Plugin đã vào danh sách duyệt. Để biết thêm, vui lòng liên hệ admin.",
                "en_US": "Plugin is in pending list now. Please consider contact the admins to know more.",
                "args": {}
            }
		},
        "author": "HyTommy",
        "version": "0.0.1"
    }
}
async function devupload (data, api){
    var fs = require("fs");
    var path = require("path");
    var axios = require("axios");
    !global.data.devtool ? global.data.devtool = {} : "";
    ensureExists(path.join(__dirname, "cache", "Devtool"));
    var FormData = require("form-data");
    var AdmZip = require("adm-zip");
    if(data.isGroup){
        api.sendMessage(global.lang["DevTool"].notInbox[global.config.bot_info.lang], data.threadID);
        return
    }
	if(global.config.facebook.admin.indexOf(data.senderID) == -1){
		api.sendMessage(global.lang["DevTool"].notAdmin[global.config.bot_info.lang], data.threadID);
		return
	}
    var args = data.body.split(" ");
    if(args.length != 3){
        api.sendMessage(global.lang["DevTool"].notEnoughParams[global.config.bot_info.lang].replace("{0}", global.config.facebook.prefix), data.threadID);
        return
    }
	var fpath = path.join(__dirname, args[2]);
	if(!fs.existsSync(fpath)){
		api.sendMessage(global.lang["DevTool"].pluginNotFound[global.config.bot_info.lang].replace("{0}", args[2]), data.threadID);
		return
	}
    var js = require(fpath).init();
	let formData = new FormData();
	formData.append("file", fs.createReadStream(fpath));
    formData.append("username", args[0]);
    formData.append("password", args[1]);
	formData.append("author", js.author);
	formData.append("ver", js.version);
    formData.append("vi", js.desc["vi_VN"]);
    formData.append("en", js.desc["en_US"]);

    if(js.obb != undefined){
        var obb = scanDir(path.join(__dirname, "obb", js.obb));
        formData.append(`obb`, js.obb);
        var zip = new AdmZip();
        zip.addLocalFolder(path.join(__dirname, "obb", js.obb));
        zip.writeZip(path.join(__dirname, "cache", "Devtool", `${js.pluginName}.zip`));
        formData.append(`file`, fs.createReadStream(path.join(__dirname, "cache", "Devtool", `${js.pluginName}.zip`)));
        fs.unlinkSync(path.join(__dirname, "cache", "Devtool", `${js.pluginName}.zip`));
    }

	try{
		var res = await axios({
			method: "post",
			url: 'https://api.vangbanlanhat.ml/upload',
			data: formData,
			headers: formData.getHeaders()
		});
        if(res.data.text == undefined){
            api.sendMessage(global.lang["DevTool"][res.data][global.config.bot_info.lang], data.threadID);
            return
        }
        else {
    		switch(res.data.text){
    			case "update?":
    			case "update?PENDING":
    				api.sendMessage(global.lang["DevTool"][res.data.text][global.config.bot_info.lang].replace("{0}", res.data.ver), data.threadID);
    				break;
    			default:
    				api.sendMessage(global.lang["DevTool"][res.data.text][global.config.bot_info.lang], data.threadID);
    		}
        }
	}
	catch(err){
		api.sendMessage(global.lang["DevTool"].requestError[global.config.bot_info.lang].replace("{0}", err), data.threadID);
	}
}

var obbFile=[];
function scanDir(dir, urm) {
    if(!urm) obbFile.length = 0;//
    var dirCT = fs.readdirSync(dir);
    for (var i of dirCT){
        //arrDir.push("/" + (path.join(dir, i)).split(path.sep).splice((path.join(dir, i)).split(path.sep).indexOf("obb") + 1, (path.join(dir, i)).split(path.sep).length).join(`/`));
        if(fs.lstatSync(path.join(dir, i)).isFile()){
            obbFile.push(path.join(dir, i));
        }
        else {
            obbFile.push(path.join(dir, i));
            obbFile.concat(scanDir(path.join(dir, i), true));
        }
    }
    return obbFile;
}
function ensureExists(path, mask) {
    var fs = require('fs');
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
	devupload,
    init
}