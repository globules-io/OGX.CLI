#!/usr/bin/env node

module.exports = (args) => {
    if(!args || args.length < 2){
        console.log('Error: Missing arguments! Expected [type] [id]', args);
        return;
    }
    if(!/(view|controller|template|stage)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs');
    let link = false;
    let template = false;
    let dest, path, file;       
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
    if(!fs.existsSync(dest)){
        console.log('Warning: File already deleted!', dest);
    }else{
        fs.unlinkSync(dest);
        console.log('Info: Deleted file', dest);
    }
    if(link){
        file = fs.readFileSync('www/index.html', 'utf-8');
        if(file){
            if(file.indexOf(link) !== -1){
                file = file.replace(link, '');
                fs.writeFileSync('www/index.html', file);
                console.log('Unlinked File:', link);  
            }else{
                console.log('Warning: File already unlinked!', dest);
            }
        }
    }else{
        if(template){
            file = fs.readFileSync('www/app.json', 'utf-8');
            if(file){
                file = JSON.parse(file);
                if(file.hasOwnProperty('preload')){
                    let idx;
                    for(let i = 0; i < file.preload.length; i++){
                        if(file.preload[i].path === template.path){
                            idx = file.preload[i].files.indexOf(template.file);
                            if(idx > -1){
                                file.preload.splice(idx, 1);
                                fs.writeFileSync('www/app.json', JSON.stringify(file, null, 4));
                                console.log('Info: Removed from preload', template);  
                                break;
                            }
                        }
                    }
                }
            }else{
                console.log('Warning: app.json file not found, preload skipped');
            }
        }   
    }
};