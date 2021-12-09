#!/usr/bin/env node
module.exports = (args) => {    
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(templates|omls|jsons|all)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs'); 

    switch(args[0]){
        case 'templates':
        unpack('html');   
        console.log('Info: unpacked templates');     
        break;

        case 'jsons':
        unpack('json');
        console.log('Info: unpacked jsons');
        break;

        case 'omls':
        unpack('oml');
        console.log('Info: unpacked omls');
        break;

        case 'all':
        unpack('html');   
        unpack('json');
        unpack('oml');
        console.log('Info: unpacked templates, jsons and omls');
        break;
    }

    function unpack(__type){
        const pak = fs.readFileSync('www/'+__type+'/'+__type+'.pak', 'utf-8');
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
            config.preload['/'+__type] = [];     
            let i, filename;
            for(i = 0; i < names.length; i++){                
                switch(__type){
                    case 'html':
                    filename = 'template.'+names[i]+'.html';
                    break;

                    default:
                    filename = names[i]+'.'+__type;
                } 
                fs.writeFileSync('www/'+__type+'/'+filename, content[i]);
                config.preload['/'+__type].push(filename);
            } 
            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
            fs.unlinkSync('www/'+__type+'/'+__type+'.pak');
        }        
    }    
}