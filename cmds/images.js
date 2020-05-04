#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const path = 'www/img';
    let files = [];
    const reg = /(\.jpg|\.png|\.gif|\.svg)/gi;
    let config;
    if(fs.existsSync(path)){
        config = fs.readFileSync('www/app.json', 'utf-8');
        if(config){
            config = JSON.parse(config);
            if(config.hasOwnProperty('preload')){
               if(config.preload.hasOwnProperty('/img')){
                   delete config.preload['/img'];
               }                  
            } 
            fs.readdirSync(path).forEach(file => {
                if(reg.test(file)){
                    console.log('Info: added to preload', file);
                    files.push(file);
                }
            });
            if(files.length){
                config.preload['/img'] = files;
            }
            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
        }else{
            console.log('Warning: app.json file not found, preload skipped');
        }
    }else{
        console.log('Warning: folder does not exist', 'www/img');
    }
};