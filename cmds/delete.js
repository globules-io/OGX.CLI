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
    let links = [];
    let template = false;
    let config, dest, path, name, file;       
    switch(args[0]){
        case 'template':
        path = 'www/html';    
        name = 'template.'+args[1]+'.html';  
        dest = path+'/'+name;      
        template = {path:'/html', file:'template.'+args[1]+'.html'};
        break;

        case 'view':
        path = 'www/js/views';      
        name = 'view.'+args[1]+'.js';
        dest = path+'/'+name;
        links.push('<script type="application/javascript" src="js/views/'+name+'"></script>');
        if(fs.existsSync('www/css/views/view.'+args[1]+'.css')){
            fs.unlinkSync('www/css/views/view.'+args[1]+'.css');
        }
        links.push('<link rel="stylesheet" href="css/views/view.'+args[1]+'.css">');
        break;

        case 'controller':
        path = 'www/js/controllers';   
        name = 'controller.'+args[1]+'.js';
        dest = path+'/'+name;
        links.push('<script type="application/javascript" src="js/controllers/'+name+'"></script>');
        break;

        case 'stage':
        path = 'www/js/stages';      
        name = 'stage.'+args[1]+'.js';  
        dest = path+'/'+name;
        links.push('<script type="application/javascript" src="js/stages/'+name+'"></script>');
        if(fs.existsSync('www/css/stages/stage.'+args[1]+'.css')){
            fs.unlinkSync('www/css/stages/stage.'+args[1]+'.css');
        }
        links.push('<link rel="stylesheet" href="css/stages/stage.'+args[1]+'.css">');
        break;
    } 
    if(!fs.existsSync(dest)){
        console.log('Warning: File already deleted!', dest);
    }else{
        fs.unlinkSync(dest);
        console.log('Info: Deleted file', dest);
    }
    if(links.length){
        file = fs.readFileSync('www/index.html', 'utf-8');
        if(file){
            for(let i = 0; i < links.length; i++){
                if(file.indexOf(links[i]) !== -1){
                    file = file.replace(links[i], '');                    
                    console.log('Unlinked File:', links[i]);  
                }else{
                    console.log('Warning: File already unlinked!', dest);
                }
            }
            fs.writeFileSync('www/index.html', file);
        }
    }else{
        if(template){
            config = fs.readFileSync('www/app.json', 'utf-8');
            if(config){
                config = JSON.parse(config);
                if(!config){
                    console.log('Error: app.json decoding error');
                    return;
                }
                if(config.hasOwnProperty('preload')){                    
                    let idx;
                    if(config.preload.hasOwnProperty(template.path)){
                        idx = config.preload[template.path].indexOf(template.file);
                        if(idx !== -1){
                            config.preload[template.path].splice(idx, 1);
                            if(!config.preload[template.path].length){
                                delete config.preload[template.path];
                            }
                            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
                            console.log('Info: Removed from preload', template);  
                        }else{
                            console.log('Warning: File not found in preload, skipped', template);  
                        }
                    }
                }
            }else{
                console.log('Warning: app.json file not found, preload skipped');
            }
        }   
    }
};