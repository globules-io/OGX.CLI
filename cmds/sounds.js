#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const path = 'www/snd';
    let files = [];
    const reg = /(\.mp3|\.ogg|\.wav)/gi;
    let file;
    if(fs.existsSync(path)){
        file = fs.readFileSync('www/app.json', 'utf-8');
        if(file){
            file = JSON.parse(file);
            if(file.hasOwnProperty('preload')){
                for(let i = 0; i < file.preload.length; i++){
                    if(file.preload[i].path === '/snd'){
                        file.preload.splice(i, 1);
                        break;
                    }
                }                    
            } 
            fs.readdirSync(path).forEach(file => {
                if(reg.test(file)){
                    console.log('Info: added to preload', file);
                    files.push(file);
                }
            });
            file.preload.push({path:'/snd', files:files});        
            fs.writeFileSync('www/app.json', JSON.stringify(file, null, 4));
        }else{
            console.log('Warning: app.json file not found, preload skipped');
        }
    }else{
        console.log('Warning: folder does not exist', 'www/snd');
    }
};