#!/usr/bin/env node

const { clear } = require('console');

module.exports = (args) => {    
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(templates|jsons|omls|all|clean|restore)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs'); 
    const folders = ['html', 'json', 'oml']; 

    backupfiles();

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

        case 'all':
        pack('html');   
        pack('json');
        pack('oml');
        console.log('Info: packed templates, jsons and omls');
        break;

        case 'clean':
        clean();
        break;

        case 'restore':
        restore();
        clean();   
        break;
    }

    function backupfiles(){
        console.log('Info: backing up files'); 
        if(!fs.existsSync('ogx')){
            fs.mkdirSync('ogx');
        }
        if(fs.existsSync('ogx/html')){
            fs.rmSync('ogx/html', {recursive:true});
        }
        if(fs.existsSync('ogx/oml')){
            fs.rmSync('ogx/oml', {recursive:true});
        }
        if(fs.existsSync('ogx/json')){
            fs.rmSync('ogx/json', {recursive:true});    
        }   
        fs.mkdirSync('ogx/html');    
        fs.mkdirSync('ogx/oml');    
        fs.mkdirSync('ogx/json');            
        for(let i = 0; i < folders.length; i++){
            if(fs.existsSync('www/'+folders[i])){  
                fs.readdirSync('www/'+folders[i]).forEach(file => {    
                    fs.copyFileSync('www/'+folders[i]+'/'+file, 'ogx/'+folders[i]+'/'+file);
                });
            }
        }
        console.log('Info: Files backed up');  
    }    

    function restore(){
        console.log('Info: restoring backed up files'); 
        for(let i = 0; i < folders.length; i++){
            if(fs.existsSync('ogx/'+folders[i])){  
                if(!fs.existsSync('www/'+folders[i])){
                    fs.mkdirSync('www/'+folders[i]);
                }
                fs.readdirSync('ogx/'+folders[i]).forEach(file => {    
                    fs.copyFileSync('ogx/'+folders[i]+'/'+file, 'www/'+folders[i]+'/'+file);
                });
            }
        }
        console.log('Info: Files restoed');             
    }

    function clean(){
        console.log('Info: cleaning back up files'); 
        if(fs.existsSync('ogx/html')){
            fs.rmSync('ogx/html', {recursive:true});
        }
        if(fs.existsSync('ogx/oml')){
            fs.rmSync('ogx/oml', {recursive:true});
        }
        if(fs.existsSync('ogx/json')){
            fs.rmSync('ogx/json', {recursive:true});    
        } 
        console.log('Info: tidy!'); 
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