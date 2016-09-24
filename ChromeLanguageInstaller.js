
var fs = require('fs');
var path = require('path');


var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
var language = settings.language;
var languagePack = settings.languagePack;
var usersPath = settings.usersPath;
var tryForAllUsers = settings.tryForAllUsers;

var directoriesToInstall = [];




if(tryForAllUsers){
  var usersSubDirectories = fs.readdirSync(usersPath);

  for(var i=0;i<usersSubDirectories.length;i++){
    directoriesToInstall.push(usersPath+usersSubDirectories[i]+"\\AppData\\Local\\Google\\Chrome\\User Data\\");
  }
}
else{
  var localStatePath = settings.localStatePath;
  
  directoriesToInstall.push(localStatePath);
}

InstallChromeLanguageForPathArray(directoriesToInstall);


function copyFile(source, target, successMsg) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);
  
  function done(err) {
	  if(err){
		  console.log("ERROR: "+err);
	  }
    
  }
}

function InstallChromeLanguageForPath(path){
    
    copyFile(languagePack, path+languagePack);
    console.log("LANGUAGE PACK '"+languagePack+"' COPIED TO: " + path);

    var localStateAbsoluteFilePate = path+"Local State";
    var localState = JSON.parse(fs.readFileSync(localStateAbsoluteFilePate, 'utf8'));

    console.log("LOCAL STATE LOADED FROM: "+path);

    if(!localState.intl){
      localState.intl = {};
    }

    if(!localState.intl.app_locale){
      localState.intl.app_locale = "";  
    }

    var oldLocale = localState.intl.app_locale+"";
    localState.intl.app_locale = language;

    console.log("CHANGED intl.app_locale value: "+oldLocale+" TO "+localState.intl.app_locale);


    fs.writeFileSync(localStateAbsoluteFilePate, JSON.stringify(localState) , 'utf-8'); 

    console.log("LOCAL STATE OVERWRITEN AT: "+path);
}

function InstallChromeLanguageForPathArray(paths){

  for(var i=0;i<paths.length;i++){
    var path = paths[i];
    var succeeded = true;
    try{
      InstallChromeLanguageForPath(path);
    }catch(err){
      succeeded = false;
    }

    if(succeeded){
      console.log("\nSucceded for path: "+path+"\n");
    }
    else{
      console.log("\nFailed for path: "+path+"\n");
    }
    
  }
}



