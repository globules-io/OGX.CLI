#!/usr/bin/env node

module.exports = (args) => {
    const exec = require('child_process').execSync;
    if(args.length < 2){
        console.log('Error: Command deploy requires a method and a build!');
        return;
    }
    if(/(android)/gi.test(args[0])){    
        args[0] = 'adb';
        console.log('Deprecation: android has been deprecated for adb, please use "ogx deploy adb" instead');
    }
    if(/(adb|ftp)/gi.test(args[0]) && /(debug|release)/gi.test(args[1])){       
        let com = false;
        switch(args[0]){
            case 'adb':
            console.log('Info: Deploying android build via ADB');
            com = 'cd platforms/android/app/build/outputs/apk/'+args[1]+' && adb install -r app-'+args[1]+'.apk'; 
            break;            
        }
        if(com){
            exec(com, function(error, stdout, stderr){
                console.dir(stdout);
            });  
            let stats = require('fs').statSync('platforms/android/app/build/outputs/apk/'+args[1]+'/app-'+args[1]+'.apk');
            console.log('Info: Build deployed, size '+Math.round(stats.size/1024)+' kb');
        }
    }else{
        console.log('Error: Command deploy requires a platform  and a build!');
    }
}