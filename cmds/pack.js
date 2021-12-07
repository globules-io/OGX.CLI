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
        packTemplates();        
        break;
    }

    function packTemplates(){
        let html = '';
        let to_unlink = [];
        let content, name;
        fs.readdirSync('www/html').forEach(file => {  
            if(/\.html$/.test(file)){
                content = fs.readFileSync('www/html/'+file, 'utf-8');
                if(content){
                    name = file.split('.');
                    name = name[1];
                    html += '<!--['+name+']-->'+content;
                    to_unlink.push('www/html/'+file);
                }               
            }
        });
        fs.writeFileSync('www/html/templates.pak', html);      
        let i;
        for(i = 0; i < to_unlink.length; i++){
            fs.unlinkSync(to_unlink[i]);
        }        
        let config = fs.readFileSync('www/app.json', 'utf-8');
        config = JSON.parse(config);
        config.preload['/html'] = ['templates.pak'];
        fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
        console.log('Info: packed templates');
    }
}