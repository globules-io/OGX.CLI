#!/usr/bin/env node
module.exports = (args) => {    
    if(!args || args.length < 3){
        console.log('Error: Missing arguments! Expected [type] [name] [new name]');
        return;
    }
    if(!/(view|controller|template|stage)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }
    const fs = require('fs');  
    let rn;
    switch(args[0]){
        case 'template':
        rn = renameTemplate(args[1], args[2]);
        if(rn){
            renameInAllFiles('Template', args[1], args[2]);
        }
        break;

        case 'view':
        rn = renameView(args[1], args[2]);
        if(rn){
            updateLink(args, 'view.'+args[1]+'.js', 'view.'+args[2]+'.js');
            updateLink(args, 'view.'+args[1]+'.css', 'view.'+args[2]+'.css');
            renameInAllFiles('View', args[1], args[2]);
        }
        break;

        case 'stage':
        rn = renameStage(args[1], args[2]);
        if(rn){
            updateLink(args, 'stage.'+args[1]+'.js', 'stage.'+args[2]+'.js');
            renameInAllFiles('Stage', args[1], args[2]);
        }
        break;

        case 'controller':
        rn = renameController(args[1], args[2]);
        if(rn){
            updateLink(args, 'controller.'+args[1]+'.js', 'controller.'+args[2]+'.js');
            renameInAllFiles('Controller', args[1], args[2]);
        }
        break;
    }

    function renameTemplate(__oldname, __newname){
        if(!fs.existsSync('www/html/template.'+__oldname+'.html')){
            console.log('Error: Template not found!', __oldname);
            return false;
        }
        fs.renameSync('www/html/template.'+__oldname+'.html', 'www/html/template.'+__newname+'.html');
        let config = loadConfig(true);
        if(config){
            let idx = config.preload['/html'].indexOf('template.'+__oldname+'.html');
            if(idx === -1){
                console.log('Warning: Template not found in preload!', __oldname);
            }else{
                config.preload['/html'][idx] = 'template.'+__newname+'.html';
                saveConfig(config, true);
            }
        }
        console.log('Info: Template renamed from', __oldname, 'to', __newname);
        return true;
    }

    function renameView(__oldname, __newname){
        if(!fs.existsSync('www/js/views/view.'+__oldname+'.js')){
            console.log('Error: View not found!', __oldname);
            return false;
        }
        let file = fs.readFileSync('www/js/views/view.'+__oldname+'.js', 'utf-8');
        file = file.replaceAll('Views.'+__oldname, 'Views.'+__newname);
        fs.writeFileSync('www/js/views/view.'+__newname+'.js', file);
        fs.unlinkSync('www/js/views/view.'+__oldname+'.js');
        if(!fs.existsSync('www/css/views/view.'+__oldname+'.css')){
            console.log('Warning: View css not found!', __oldname);            
        }else{
            fs.renameSync('www/css/views/view.'+__oldname+'.css', 'www/css/views/view.'+__newname+'.css');
        }
        let config = loadConfig(false);
        if(config){
            config = config.replaceAll('Views.'+__oldname, 'Views.'+__newname);
            saveConfig(config, false);
        }
        console.log('Info: View renamed from', __oldname, 'to', __newname);
        return true;
    }

    function renameStage(__oldname, __newname){
        if(!fs.existsSync('www/js/stages/stage.'+__oldname+'.js')){
            console.log('Error: Stage not found!', __oldname);
            return;
        }
        let file = fs.readFileSync('www/js/stages/stage.'+__oldname+'.js', 'utf-8');
        file = file.replaceAll('Stages.'+__oldname, 'Stages.'+__newname);
        fs.writeFileSync('www/js/stages/stage.'+__newname+'.js', file);
        fs.unlinkSync('www/js/stages/stage.'+__oldname+'.js');
        if(!fs.existsSync('www/css/stages/stage.'+__oldname+'.css')){
            console.log('Warning: Stage css not found!', __oldname);            
        }else{
            fs.renameSync('www/css/stages/stage.'+__oldname+'.css', 'www/css/stages/stage.'+__newname+'.css');
        }
        let config = loadConfig(false);
        if(config){
            config = config.replaceAll('Stages.'+__oldname, 'Stages.'+__newname);
            saveConfig(config, false);
        }
        console.log('Info: Stags renamed from', __oldname, 'to', __newname);      
        return true;  
    }

    function renameController(__oldname, __newname){
        if(!fs.existsSync('www/js/controllers/controller.'+__oldname+'.js')){
            console.log('Error: Controller not found!', __oldname);
            return false;
        }
        let file = fs.readFileSync('www/js/controllers/controller.'+__oldname+'.js', 'utf-8');
        file = file.replaceAll('Controllers.'+__oldname, 'Controllers.'+__newname);
        fs.writeFileSync('www/js/controllers/controller.'+__newname+'.js', file);
        fs.unlinkSync('www/js/controllers/controller.'+__oldname+'.js');
        let config = loadConfig(false);
        if(config){
            config = config.replaceAll('Controllers.'+__oldname, 'Controllers.'+__newname);
            saveConfig(config, false);
        }
        console.log('Info: Controller renamed from', __oldname, 'to', __newname); 
        return true;
    }    

    function renameInAllFiles(__object_type, __old_name, __name){
        const paths = ['www/json', 'www/oml', 'www/js/views', 'www/js/stages', 'www/js/controllers'];
        const exts = ['.json', '.oml', '.js', '.js', '.js'];
        for(let i = 0; i < paths.length; i++){
            renameInFiles(paths[i], exts[i], __object_type, __old_name, __name);
        }
        renameInFile('www/app.json', __object_type, __old_name, __name);
    }

    function renameInFiles(__path, __file_ext, __object_type, __old_name, __name){
        if(!fs.existsSync(__path)){
            console.log('Warning: path not found', __path); 
            return;
        }       
        fs.readdirSync(__path).forEach(file => {  
            if(file.indexOf(__file_ext) !== -1){
                renameInFile(__path+'/'+file, __object_type, __old_name, __name);                
            }
        });
    }

    function renameInFile(__filepath, __object_type, __old_name, __name){
        if(!fs.existsSync(__filepath)){
            console.log('Warning: file not found', __filepath); 
            return;
        }
        let str = fs.readFileSync(__filepath, 'utf8');
        if(str){ 
            str = str.replaceAll(__object_type+'s.'+__old_name, __object_type+'s.'+__name);
            if(__object_type === 'Template'){
                const reg = new RegExp('("template" ?: ?)("'+__old_name+'")', 'g');
                str = str.replace(reg, '$1'+'"'+__name+'"');
            }                   
            fs.writeFileSync(__filepath, str);
        }
    }

    function updateLink(__args, __oldname, __newname){
        let options = __args[__args.length-1];
        let file = fs.readFileSync('www/'+options.index, 'utf-8');
        if(file){
            file = file.replaceAll(__oldname, __newname);
            fs.writeFileSync('www/'+options.index, file);
        }
    }

    function loadConfig(__parse){
        if(!fs.existsSync('www/app.json')){
            console.log('Error: app.json not found');   
            return false;
        }
        let config = fs.readFileSync('www/app.json', 'utf-8');
        if(config){
            if(__parse){
                config = JSON.parse(config);
            }
            return config;
        } 
        return false;
    };

    function saveConfig(__config, __stringify){
        if(__stringify){
           __config = JSON.stringify(__config, null, 4);
        }
        fs.writeFileSync('www/app.json', __config);
    };
}