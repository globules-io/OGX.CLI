#!/usr/bin/env node
module.exports = (args) => {    
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(template)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs'); 

    switch(args[0]){
        case 'templates':
        unpackTemplates();        
        break;
    }

    function unpackTemplates(){
        const pak = fs.readFileSync('www/html/templates.pak', 'utf-8');
        if(pak){
            //extract names
            let m;
            let reg = /<!--\[([a-zA-Z0-9_\-]+)\]-->/g;
            let names = [];
            while(m = reg.exec(pak)){
                names.push(m[1]);
            } 
            //split templates  
            reg = /<!--\[[a-zA-Z0-9_\-]+\]-->/g;           
            let content = pak.split(reg);
            content.shift();
            //write
            let config = fs.readFileSync('www/app.json', 'utf-8');
            config = JSON.parse(config);
            config.preload['/html'] = [];     
            let i;
            for(i = 0; i < names.length; i++){
               fs.writeFileSync('www/html/template.'+names[i]+'.html', content[i]);
               config.preload['/html'].push('template.'+names[i]+'.html');
            } 
            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
            fs.unlinkSync('www/html/templates.pak');
        }        
        console.log('Info: unpacked templates');
    }
}