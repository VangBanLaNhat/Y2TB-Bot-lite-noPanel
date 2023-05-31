const git = require("download-git-repo");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

const save = {
	file: ["core/coreconfig.json"],
	folder: [
		".git",
		"data",
		"lang",
		"logs",
		"node_modules",
		"plugins",
		"temp",
		"udata"
	]
}

async function main() {
	//let t;
	let lk = "VangBanLaNhat/Y2TB-Bot"
	let t = await git('github:VangBanLaNhat/Y2TBBot', 'temp', function (err) {
		console.log(err ? 'Error' : 'Success');
		// bcccct =1;
		if(err) return console.log(err); //code tiep di, t đang cài cho Dung cái thoi =)) dạ :))))
		let dir = path.join(__dirname, "..", "..", "test");
		let listF = fs.readdirSync(dir);
		let ct=[];
		for(let i of save.file){
			if(fs.existsSync(path.join(dir, i))){
				ct.push({
					content: fs.readFileSync(path.join(dir, i)),
					path: i
				})
			}
			
		}
		for(let f of listF){
			if(fs.lstatSync(path.join(dir, f)).isFile()){
                fs.unlinkSync(path.join(dir, f));
            } else if(save.folder.indexOf(f) == -1){
            	removeDir(path.join(dir, f));
            }
		}
		let listFUD = fs.readdirSync(path.join(__dirname, "..", "..", "temp"));
		for(let f of listFUD){
			console.log(f)
			fse.moveSync(path.join(__dirname, "..", "..", "temp", f), path.join(dir, f), { overwrite: true });
		}
		for(let i of ct){
			let fd = i.path.split("/");
			fd.length = fd.length-1;
			fd = fd.join("/");
			console.log(ensureExists(path.join(dir ,fd)))
			if(fs.existsSync(path.join(dir, i.path)))
				fs.writeFileSync(path.join(dir, i.path), i.content);
			}
	})
	console.log(t);
}

function removeDir(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function(filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
         	removeDir(path + "/" + filename)
        } else {
        	try{
				fs.unlinkSync(path + "/" + filename);
				console.log(path + "/" + filename);
			}catch(e){}
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

function ensureExists(path, func, mask) {
  if (typeof mask != 'number') {
    mask = 0o777;
  }
  try {
    fs.mkdirSync(path, {
      mode: mask,
      recursive: true
    });
    //func();
    return;
  } catch (ex) {
    return {
      err: ex
    };
  }
}

module.exports = main;