#!/usr/bin/env node
module.exports = (args) => {    
    const homeDir = require('os').homedir();
    const desktopDir = `${homedir}/Desktop`;
    var com = 'adb logcat > '+desktopDir+'/ogx-debug.txt';
    console.log('Info: ADB logging to '+desktopDir+', break task to stop.');
    exec(com, function(error, stdout, stderr){
        console.dir(stdout);
    }); 
};