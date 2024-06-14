#!/usr/bin/env node

module.exports = (args) => {
    const exec = require('child_process').execSync;
    //depends if we do a platform build or a release/reset build
    if(/(ios|android|desktop)/gi.test(args[0]) && args.length < 2){    
        console.log('Error: Command build requires a target and a platform!');
        return;
    }
    if(/(ios|android|desktop|release|restore)/gi.test(args[0])){
        let com = false;
        let log;
        switch(args[0]){
            case 'ios':
            console.log('Info: Building cordova ios');
            com = 'cordova build ios';          
            break;

            case 'android':
            log = 'Info: Building cordova android';           
            com = 'cordova build android';
            if(args[1] && args[1] === 'release'){
                com += ' --release -- --packageType=bundle';
                log += ' release';
            }else{
                log += ' debug';
            }
            console.log(log);
            break;

            case 'desktop':
            console.log('Info: Building neutralino');
            com = 'neu build';
            break;

            case 'release':
            if(args.length === 3){
                args.unshift();
            }
            require('./release.js')(args);
            break;

            case 'restore':
            if(args.length === 3){
                args.unshift();                
            }
            require('./reset.js')(args);
            break;
        }
        if(com){
            exec(com, function(error, stdout, stderr) {
                console.dir(stdout);
            });
        }
    }else{
        console.log('Error: Invalid platform!');
    }
};