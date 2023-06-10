function normal () {
	return{
    	"bot_info": {
    		"botname": "Y2TBbot",
    		"lang": "en_US"
    	},
    	"facebook": {
    		"FBemail": "",
    		"FBpassword": "",
    		"prefix": "/",
    		"admin": [],
    		"autoMarkRead": true,
    		"selfListen": false,
    		"UIDmode": "disabled",
    		"blackList": [],
    		"whiteList": []
    	}
    }
}

function core() {
	return{
    	"main_bot": {
    		"consoleColor": "32",
    		//https://upload.wikimedia.org/wikipedia/commons/3/34/ANSI_sample_program_output.png
    		"dataSaveTime": "5",
    		"developMode": false,
    		"toggleLog": true,
    		"toggleDebug": false
    	},
    	"facebook": {
    		"logLevel": "error",
    		"userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    		"listenEvents": true,
    		"updatePresence": false
    	}
    }
}

module.exports = {
	normal,
	core
}
