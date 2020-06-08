#!/usr/bin/env node

module.exports = (args) => {
    const exec = require('child_process').execSync;
    if(args.length < 2){
        console.log('Error: Command build requires a target and a platform!');
        return;
    }
    if(/(ios|android|windows|mac|linux)/gi.test(args[0])){
        let com = false;
        switch(args[0]){
            case 'ios':
            console.log('Info: Building cordova ios');
            com = 'cordova build ios';          
            break;

            case 'android':
            console.log('Info: Building cordova android');
            com = 'cordova build android';
            if(args[2] && args[2] === 'release'){
                com += ' --release -- --packageType=bundle';
            }
            break;

            case 'desktop':

            break;
        }
        if(com){
            exec(com);
        }
    }else{
        console.log('Error: Invalid platform!');
    }
};