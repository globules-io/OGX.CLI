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
    switch(args[0]){
        case 'template':
        deleteTemplate(args[1]);        
        break;

        case 'view':
        deleteView(args[1]);       
        break;

        case 'controller':
        deleteController(args[1]);       
        break;

        case 'stage':
        deleteStage(args[1]);       
        break;
    } 

    if(links.length){
       removeLinks(args);
    }

    function deleteTemplate(__name){
        let filename = 'template.'+__name+'.html';  
        let filepath = 'www/html/'+filename;       
        let config = loadConfig();
        if(config){
            let idx = config.preload['/html'].indexOf(filename);
            if(idx !== -1){
                config.preload['/html'].splice(idx, 1);
                saveConfig(config);
                console.log('Info: File removed from preload', filename);
            }else{
                console.log('Warning: File not found in preload!', filename);
            }
        }else{
            console.log('Warning: app.json file not found');      
        }
        if(!fs.existsSync(filepath)){
            console.log('Warning: File already deleted!', filename);
        }else{
            fs.unlinkSync(filepath);
            console.log('Info: Deleted file', filename);
        }
    }

    function deleteStage(__name){
        let filename = 'stage.'+__name+'.js';  
        let filepath = 'www/js/stages/'+filename;    
        if(!fs.existsSync(filepath)){
            console.log('Warning: File already deleted!', filename);
        }else{
            fs.unlinkSync(filepath);
            links.push('<script type="application/javascript" src="js/stages/'+filename+'"></script>')
            console.log('Info: Deleted file', filename);
        }
        let config = loadConfig();
        if(config){
            let vapp = __name.toLowerCase()+'.Stages.'+__name;
            for(let a in config.vapps){
                if(a === vapp){
                    delete config.vapps[a];
                    console.log('Info: Deleted virtual app', __name);
                    break;
                }
            }
            saveConfig(config);
        }else{
            console.log('Warning: app.json file not found');      
        }
    }

    function deleteController(__name){
        let filename = 'controller.'+__name+'.js';  
        let filepath = 'www/js/controllers/'+filename;   
         if(!fs.existsSync(filepath)){
            console.log('Warning: File already deleted!', filename);
        }else{
            fs.unlinkSync(filepath);
            links.push('<script type="application/javascript" src="js/controllers/'+filename+'"></script>');
            console.log('Info: Deleted file', filename);
        }         
    }

    function deleteView(__name){
        let filename = 'view.'+__name+'.js';
        let filepath = 'www/js/views/'+filename; 
        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
            links.push('<script type="application/javascript" src="js/views/'+filename+'"></script>');
            console.log('Info: Deleted file', filename);
        }  
        filename = 'view.'+__name+'.css';
        filepath = 'www/css/views/'+filename;
        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
            links.push('<link rel="stylesheet" href="css/views/view.'+__name+'.css">');
            console.log('Info: Deleted file', filename);
        }else{
            console.log('Warning: File already deleted!', filename);
        }
    }

    function removeLinks(__args){
        let options = __args[__args.length-1];
        let file = fs.readFileSync('www/'+options.index, 'utf-8');
        if(file){
            for(let i = 0; i < links.length; i++){
                if(file.indexOf(links[i]) !== -1){
                    file = file.replace(links[i], '');                    
                    console.log('Unlinked File:', links[i]);  
                }else{
                    console.log('Warning: File already unlinked!', links[i]);
                }
            }
            fs.writeFileSync('www/'+options.index, file);
        }
    }
    
    function loadConfig(){
        let config = fs.readFileSync('www/app.json', 'utf-8');
        if(config){
            config = JSON.parse(config);
            return config;
        }       
        console.log('Error: app.json decoding error');   
        return false;
    };

    function saveConfig(__config){
        fs.writeFileSync('www/app.json', JSON.stringify(__config, null, 4));
    };
};