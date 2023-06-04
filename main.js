/*
* Function created by C3C BotChat
* https://github.com/c3cbot/legacy-c3cbot
*/

var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");
var fetch = require("node-fetch");
//const git = require("download-git-repo");
const fse = require("fs-extra");

var log = require("./core/util/log.js");

console.logg = console.log;
console.log = log.log;
console.error = log.err;
console.warn = log.warn;
console.blank = log.blank;

(async () => {
  ensureExists(path.join(__dirname, "data"));
  fs.writeFileSync(path.join(__dirname, "data", "isStart.txt"), "1");

  var semver = require("semver");
  var nodeVersion = semver.parse(process.version);
  if (nodeVersion.major < 12 || (nodeVersion.major == 12 && nodeVersion.minor < 9)) {
    console.error("MAIN", "ERROR: Node.JS 12+ (>=12.9) required in this version!");
    console.error("MAIN", "Node.JS version running this bot:", process.version);
    process.exit(1);
  }

  try{
    //await require(path.join(__dirname, "core", "util", "dlUpdate.js"))();
  }catch(e){};

  function spawn(cmd, arg) {
    return new Promise(resolve => {
      var npmProcess = childProcess.spawn(cmd, arg, {
        shell: true,
        stdio: "pipe",
        cwd: __dirname
      });
      npmProcess.on("close", function (code) {
        resolve(code);
      });
    });
  }

  async function loader(first) {
    if (!first) {
      console.log();
      console.log("MAIN",`7378278(RESTART) error code found. Restarting...`);
    }
    child = childProcess.spawn("node", ["--trace-warnings", "index.js"], {
      cwd: __dirname,
      maxBuffer: 16384 * 1024,
      stdio: 'inherit',
      shell: true
    });
    child.on("close", async (code) => {
      //UNIX, why? (limited to 8-bit)
      //Original code: 7378278
      if (code % 256 == 102) {
        await loader(false);
        return;
      }

      console.log();
      console.log("MAIN", `Function Index throw ${code} (not 7378278(RESTART)). Shutting down...`);
      
      fs.writeFileSync(path.join(__dirname, "data", "isStart.txt"), "0");
      process.exit();
    });
    child.on("error", function (err) {
      console.log();
      console.log("MAIN","Error:"+err);
    });
  }

  //Check Update
  /*let text;
  //https://raw.githubusercontent.com/VangBanLaNhat/Y2TB-Bot/master/package.json
    //https://raw.githubusercontent.com/VangBanLaNhat/Y2TBBot/main/package.json
    let link = "https://raw.githubusercontent.com/VangBanLaNhat/Y2TB-Bot/master/package.json"
  try{
    let vs = await fetch(link);
    text = await vs.text();
  }catch(e){
    text == "404: Not Found";
  };
  if(text == "404: Not Found"){
    if(link=="https://raw.githubusercontent.com/VangBanLaNhat/Y2TBBot/main/package.json") return console.error("UPDATE", "Can't connect to Github. Existing...") //text = "{\"version\": \"1.0.0\"}";
    return await loader(true);
  }
  while(text.indexOf("\\n\\r") != -1){
      text.replace("\\n\\r", "\n")
  }
  let json = JSON.parse(text)
  if(json.version != "1.0.0"){
    let lk = "VangBanLaNhat/Y2TB-Bot"
    git('github:VangBanLaNhat/Y2TBBot', 'temp', async function (err) {
      //console.log(err ? 'Error' : 'Success');
      // bcccct =1;
      if(err) return console.log(err); //code tiep di, t đang cài cho Dung cái thoi =)) dạ :))))
      let dir = path.join(__dirname);
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
      let listFUD = fs.readdirSync(path.join(__dirname, "temp"));
      for(let f of listFUD){
        //console.log(f)
        fse.moveSync(path.join(__dirname, "temp", f), path.join(dir, f), { overwrite: true });
      }
      for(let i of ct){
        let fd = i.path.split("/");
        fd.length = fd.length-1;
        fd = fd.join("/");
        console.log(ensureExists(path.join(dir ,fd)))
        if(fs.existsSync(path.join(dir, i.path)))
          fs.writeFileSync(path.join(dir, i.path), i.content);
      }
      await loader(true);
    })
  } else */
  await loader(true);
  
  /**/
})();

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
        console.log("UPDATE" ,path + "/" + filename);
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