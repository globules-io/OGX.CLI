#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const path = 'www/html';
    let files = [];
    const reg = /(\.html|\.htm)$/gi;
    let config;
    if(fs.existsSync(path)){
        config = fs.readFileSync('www/app.json', 'utf-8');
        if(config){
            config = JSON.parse(config);
            if(config.hasOwnProperty('preload')){
               if(config.preload.hasOwnProperty('/html')){
                   delete config.preload['/html'];
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
                config.preload['/html'] = files;
            }
            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
        }else{
            console.log('Warning: app.json file not found, preload skipped');
        }
    }else{
        console.log('Warning: folder does not exist', 'www/html');
    }
};