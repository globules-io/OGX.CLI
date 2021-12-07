#!/usr/bin/env node
module.exports = (args) => {    
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(templates|jsons|omls)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs'); 

    switch(args[0]){
        case 'templates':
        pack('html');   
        console.log('Info: packed templates');     
        break;

        case 'jsons':
        pack('json');
        console.log('Info: packed jsons');
        break;

        case 'omls':
        pack('oml');
        console.log('Info: packed omls');
        break;
    }

    function pack(__type){
        let html = '';
        let to_unlink = [];
        let content, name;
        const reg = new RegExp('\\.'+__type+'$', 'i');
        fs.readdirSync('www/'+__type).forEach(file => {  
            if(reg.test(file)){
                content = fs.readFileSync('www/'+__type+'/'+file, 'utf-8');
                if(content){
                    name = file.split('.');
                    __type === 'html' ? name = name[1] : name = name[0];
                    html += '<!--['+name+']-->'+content;
                    to_unlink.push('www/'+__type+'/'+file);
                }               
            }
        });
        fs.writeFileSync('www/'+__type+'/'+__type+'.pak', html);      
        let i;
        for(i = 0; i < to_unlink.length; i++){
            fs.unlinkSync(to_unlink[i]);
        }        
        let config = fs.readFileSync('www/app.json', 'utf-8');
        config = JSON.parse(config);
        config.preload['/'+__type] = [__type+'.pak'];
        fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
    }    
}