#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const path = 'www/snd';
    let files = [];
    const reg = /(\.mp3|\.wav|\.ogg)$/gi;
    let config;
    if(fs.existsSync(path)){
        config = fs.readFileSync('www/app.json', 'utf-8');
        if(config){
            config = JSON.parse(config);
            if(config.hasOwnProperty('preload')){
               if(config.preload.hasOwnProperty('/snd')){
                   delete config.preload['/snd'];
               }                  
            } 
            fs.readdirSync(path).forEach(file => {
                if(reg.test(file)){
                    console.log('Info: added to preload', file);
                    files.push(file);
                }
                reg.lastIndex = 0;
            });
            if(files.length){
                config.preload['/snd'] = files;
            }
            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
        }else{
            console.log('Warning: app.json file not found, preload skipped');
        }
    }else{
        console.log('Warning: folder does not exist', 'www/snd');
    }
};