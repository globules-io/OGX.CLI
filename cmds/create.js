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
    let links = [];
    let tem;
  
    switch(args[0]){
        case 'template':
        createTemplate(args[1]);        
        break;

        case 'view':
        tem = false;
        if(typeof(args[2]) === 'string'){
            tem = args[2];
        }
        createView(args[1], tem);        
        break;

        case 'stage':
        tem = false;
        if(typeof(args[2]) === 'string'){
            tem = args[2];
        }
        createStage(args[1], tem); 
        break;

        case 'controller':
        createController(args[1]);
        break;        
    }   

    if(links.length){
        writeLinks(args);
    }

    function writeLinks(__args){
        let options = __args[__args.length-1];
        let file = fs.readFileSync('www/'+options.index, 'utf-8');
        if(file){
            let reg;
            for(let i = 0; i < links.length; i++){
                reg = new RegExp('/'+links[i]+'/gi');
                if(!reg.test(file)){
                    file = file.replace('</head>', links[i]+'\n</head>');                    
                    console.log('Info: File linked', links[i]);  
                }else{
                    console.log('Warning: File already linked!');
                }
            }
            fs.writeFileSync('www/'+options.index, file);
        }else{
            console.log('Warning:', options.index, 'file not found, linking skipped');
        }
    } 

    function createController(__name){
        let file = 'controller.'+__name+'.js';
        let made = makeFile('controller', __name);
        if(made){
            links.push('<script type="application/javascript" src="js/controllers/'+file+'"></script>');
        }      
    }
    
    function createView(__name, __template_name){
        let file = 'view.'+__name+'.js';       
        let made = makeFile('view', __name);
        if(made){  
            if(!fs.existsSync('www/css/views')){
                fs.mkdirSync('www/css/views', {recursive:true});            
            }
            fs.writeFileSync('www/css/views/view.'+__name+'.css', '/* CSS */');     
            links.push('<link rel="stylesheet" href="css/views/view.'+__name+'.css">');    
            links.push('<script type="application/javascript" src="js/views/'+file+'"></script>');
            if(__template_name){
                createTemplate(__template_name);
            }
        }              
    }

    function createStage(__stage_name, __template_name){         
        let made = makeFile('stage', __stage_name);
        if(made){              
            if(!fs.existsSync('www/css/stages')){
                fs.mkdirSync('www/css/stages', {recursive:true});            
            }
            fs.writeFileSync('www/css/stages/stage.'+__stage_name+'.css', '/* CSS */');
            links.push('<script type="application/javascript" src="js/stages/stage.'+__stage_name+'.js"></script>');
            links.push('<link rel="stylesheet" href="css/stages/stage.'+__stage_name+'.css">');
            config = loadConfig();
            if(config){
                if(!config.hasOwnProperty('vapps')){
                    config.vapps = {};
                }
                let t = '';
                if(__template_name){
                    saveConfig(config);
                    createTemplate(__template_name);
                    t = __template_name;   
                    config = loadConfig();
                }
                config.vapps[args[1].toLowerCase()+':Stages.'+args[1]] = {
                    template:t,
                    use:false,
                    home:'',
                    scope:['public'],
                    theater:false
                }
                saveConfig(config);
            }else{           
                console.log('Warning: app.json file not found');      
            }  
        }      
    }

    function createTemplate(__name){
        let path = '/html';  
        let file = 'template.'+__name+'.html'; 
        fs.writeFileSync('www/html/'+file, '<span></span>'); 
        let config = loadConfig();
        if(config){   
            if(!config.hasOwnProperty('preload')){
                config.preload = {};
            }                
            if(!config.preload.hasOwnProperty(path)){
                config.preload[path] = [file];                    
            }else{
                config.preload[path].push(file);
            }
            console.log('Info: Added to preload', path+'/'+file); 
            saveConfig(config);
        }else{
            console.log('Warning: app.json file not found, preload skipped');
        } 
    }

    function makeFile(__type, __name){
        const filename = __type+'.ogx';       
        let rp =  require('path').resolve(__dirname, '../files/'+filename);
        let file = fs.readFileSync(rp, 'utf-8');
        file = file.replace(/{{NAME}}/gi, __name);
        let path, name, dest;
        switch(__type){
            case 'view':
            path = 'www/js/views';
            name = 'view.'+__name+'.js';    
            break;           

            case 'controller':
            path = 'www/js/controllers';
            name = 'controller.'+__name+'.js';    
            break;

            case 'stage':
            path = 'www/js/stages';
            name = 'stage.'+__name+'.js';    
            break;
        }
        dest = path+'/'+name;
        if(!fs.existsSync(path)){
            fs.mkdirSync(path, {recursive:true});
        }
        if(!fs.existsSync(dest)){
            fs.writeFileSync(dest, file);    
        }else{
            console.log('Error: File already exists!', dest);
            return false;
        } 
        return true;
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