#!/usr/bin/env node

module.exports = (args) => {
    const exec = require('child_process').execSync;
    if(args.length < 2){
        console.log('Error: Command build requires a target and a platform!');
        return;
    }
    if(/(ios|android|windows|mac|linux)/gi.test(args[1])){
        switch(args[1]){
            case 'ios':
            console.log('Info: Building cordova ios');
            let cmd = 'cordova build '+args[2]; 
            exec(cmd);           
            break;

            case 'android':
            console.log('Info: Building cordova android');
            let cmd = 'cordova build '+args[2];
            if(args[3] && args[3] === 'release'){
                cmd += ' --release -- --packageType=bundle';
            }
            exec(cmd);
            break;

            case 'desktop':

            break;
        }
    }
};