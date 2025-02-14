#!/usr/bin/env node

const { copy } = require('fs-extra');

module.exports = (args) => {    
    if(!args || args.length < 2){
        console.log('Error: Missing arguments! Expected [type] [folder_name]');
        return;
    }
    if(!/(view|controller|template|stage)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs');    
    let dest_path = './../'+args[2]+'/';
    let source_path;
    let sources = [];
    var dests = [];
    switch(args[0]){
        case 'template':
        source_path = 'www/html/template.'+args[1]+'.html';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        break;

        case 'view':
        source_path = 'www/js/views/view.'+args[1]+'.js';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        source_path = 'www/css/views/view.'+args[1]+'.css';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        source_path = 'www/html/template.'+args[1]+'.html';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        break;

        case 'stage':
        source_path = 'www/js/stages/stage.'+args[1]+'.js';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        source_path = 'www/css/stages/stage.'+args[1]+'.css';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        source_path = 'www/html/template.'+args[1]+'.html';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        break;

        case 'controller':
        source_path = 'www/js/controllers/controller.'+args[1]+'.js';
        sources.push(source_path);
        dests.push(dest_path+source_path);
        break;
    }  
    
    for(let i = 0; i < sources.length; i++){
        console.log('Info: Copying '+args[0]+' '+args[1]+' to '+args[2]);
        if(!fs.existsSync(sources[i])){
            console.log('Error: Path does not exist '+sources[i]);
            continue;
        }
        if(fs.existsSync(dests[i])){
            console.log('Error: Path already exists '+dests[i]);
            continue;
        }
        copy(sources[i], dests[i]);
        console.log('Info: Done copying!');
    };  
}
    