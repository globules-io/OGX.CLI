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
    let links = [];
    let template = false;
    let config, name, dest, path;        
    switch(args[0]){
        case 'template':
        path = 'www/html';   
        name = 'template.'+args[1]+'.html'; 
        dest = path+'/'+name;      
        template = {path:'/html', file:name};
        break;

        case 'view':
        path = 'www/js/views';   
        name = 'view.'+args[1]+'.js';    
        dest = path+'/'+name;        
        if(!fs.existsSync('www/css/views')){
            fs.mkdirSync('www/css/views', {recursive:true});            
        }
        fs.writeFileSync('www/css/views/view.'+args[1]+'.css', '/* CSS */');
        links.push('<script type="application/javascript" src="js/views/'+name+'"></script>');
        links.push('<link rel="stylesheet" href="css/views/view.'+args[1]+'.css">');
        break;

        case 'stage':
        path = 'www/js/stages'; 
        name = 'stage.'+args[1]+'.js';           
        dest = path+'/'+name;    
        if(!fs.existsSync('www/css/stages')){
            fs.mkdirSync('www/css/stages', {recursive:true});            
        }
        fs.writeFileSync('www/css/stages/stage.'+args[1]+'.css', '/* CSS */');
        links.push('<script type="application/javascript" src="js/stages/'+name+'"></script>');
        links.push('<link rel="stylesheet" href="css/stages/stage.'+args[1]+'.css">');
        break;

        case 'controller':
        path = 'www/js/controllers';   
        name = 'controller.'+args[1]+'.js';    
        dest = path+'/'+name;   
        links.push('<script type="application/javascript" src="js/controllers/'+name+'"></script>');
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
    if(links.length){
        let options = args[args.length-1];
        file = fs.readFileSync('www/'+options.index, 'utf-8');
        if(file){
            //add in head
            var reg;
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
    }else{
        if(template){
            config = fs.readFileSync('www/app.json', 'utf-8');
            if(config){
                config = JSON.parse(config);
                if(!config){
                    console.log('Error: app.json decoding error');
                    return;
                }
                if(!config.hasOwnProperty('preload')){
                    config.preload = {};
                }                
                if(!config.preload.hasOwnProperty(template.path)){
                    config.preload[template.path] = [template.file];                    
                }else{
                    config.preload[template.path].push(template.file);
                }
                console.log('Info: Added to preload', template);  
                fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
            }else{
                console.log('Warning: app.json file not found, preload skipped');
            }           
        }
    }    
}