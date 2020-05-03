#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const path = 'www/json';
    let files = [];
    const reg = /(\.json)/gi;
    let file;
    if(fs.existsSync(path)){
        file = fs.readFileSync('www/app.json', 'utf-8');
        if(file){
            file = JSON.parse(file);
            if(file.hasOwnProperty('preload')){
                for(let i = 0; i < file.preload.length; i++){
                    if(file.preload[i].path === '/json'){
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
            file.preload.push({path:'/json', files:files});        
            fs.writeFileSync('www/app.json', JSON.stringify(file, null, 4));
        }else{
            console.log('Warning: app.json file not found, preload skipped');
        }
    }else{
        console.log('Warning: folder does not exist', 'www/json');
    }
};