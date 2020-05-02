#!/usr/bin/env node

module.exports = (args) => {
    if(!args || args.length < 2){
        console.log('Error: Missing arguments! Expected [type] [id]');
        return;
    }
    if(!/(view|controller|template|stage)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs');
    const filename = args[0]+'.ogx';   
    let file = fs.readFileSync('./files/'+filename, 'utf-8');
    file = file.replace(/{{NAME}}/gi, args[1]);
    let link = false;
    let template = false;
    let dest, path;        
    switch(args[0]){
        case 'template':
        path = 'www/html';       
        dest = path+'/template.'+args[1]+'.html';      
        template = {path:'/html', file:'template.'+args[1]+'.html'};
        break;

        case 'view':
        path = 'www/js/views';      
        dest = path+'/view.'+args[1]+'.js';
        link = '<script type="text/javascript" src="'+dest+'"></script>';
        break;

        case 'controller':
        path = 'www/js/controller';   
        dest = path+'/controller.'+args[1]+'.js';
        link = '<script type="text/javascript" src="'+dest+'"></script>';
        break;

        case 'stage':
        path = 'www/js/stages';        
        dest = path+'/stage.'+args[1]+'.js';
        link = '<script type="text/javascript" src="'+dest+'"></script>';
        break;
    }
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, {recursive:true});
    }
    if(!fs.existsSync(dest)){
        fs.writeFileSync(dest, file);    
    }else{
        console.log('Error: File already exists!', dest);
        return;
    } 
    console.log('Created file:', args[0], dest);   
    if(link){
        file = fs.readFileSync('www/index.html', 'utf-8');
        if(file){
            //add in head
            var reg = new RegExp('/'+link+'/gi');
            if(!reg.test(file)){
                file = file.replace('</head>', link+'\n</head>');
                fs.writeFileSync('www/index.html', file);
                console.log('Linked File:', link);  
            }else{
                console.log('Warning: File already linked!');
            }
        }else{
            console.log('Warning: index.html file not found, linking skipped');
        }
    }else{
        if(template){
            file = fs.readFileSync('www/app.json', 'utf-8');
            if(file){
                file = JSON.parse(file);
                if(!file){
                    file = {};
                }
                if(!file.hasOwnProperty('preload')){
                    file.preload = [];
                }
                let found = false;
                for(let i = 0; i < file.preload.length; i++){
                    if(file.preload[i].path === template.path && file.preload[i].files.indexOf(template.file) === -1){                       
                        found = true;
                        break;
                    }
                }
                if(!found){
                    file.preload.push({path:template.path, files:[template.file]});
                    console.log('Added to preload:', template);  
                }
                fs.writeFileSync('www/app.json', JSON.stringify(file, null, 4));
            }else{
                console.log('Warning: app.json file not found, preload skipped');
            }           
        }
    }    
}