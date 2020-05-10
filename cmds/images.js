#!/usr/bin/env node

/*
Should do themes as well
*/
module.exports = (args) => {
    const fs = require('fs');
    const paths = ['/img'];
    let files = [];
    const reg = /(\.jpg|\.png|\.gif|\.svg)$/gi;
    let config;    
    config = fs.readFileSync('www/app.json', 'utf-8');
    if(config){
        config = JSON.parse(config);    
        //merge with themes
        if(fs.existsSync('www/themes')){
            fs.readdirSync('www/themes').forEach(folder => {  
                if(fs.existsSync('www/themes/'+folder+'/base/img')){
                    paths.push('/themes/'+folder+'/base/img');
                }
                if(fs.existsSync('www/themes/'+folder+'/light/img')){
                    paths.push('/themes/'+folder+'/light/img');
                }
                if(fs.existsSync('www/themes/'+folder+'/dark/img')){
                    paths.push('/themes/'+folder+'/dark/img');
                }
            });
        }
        for(let i = 0; i < paths.length; i++){
            files = [];
            if(fs.existsSync('www'+paths[i])){
                fs.readdirSync('www'+paths[i]).forEach(file => {
                    if(reg.test(file)){
                        console.log('Info: added to preload', file);
                        files.push(file);
                    }
                    reg.lastIndex = 0;
                });                
            }
            if(files.length){
                if(config.hasOwnProperty('preload')){
                    if(config.preload.hasOwnProperty(paths[i])){
                        delete config.preload[paths[i]];
                    }                  
                } 
                config.preload[paths[i]] = files;
            }
        }        
        fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
    }else{
        console.log('Warning: app.json file not found, preload skipped');
    }    
};