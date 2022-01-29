#!/usr/bin/env node
module.exports = (args) => {    
    if(!args){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(views|controllers|templates|stages|images|all)/gi.test(args[0])){
        console.log('Error: Invalid arguments!');
        return;
    }
    const fs = require('fs');      
    let types = [args[0]];
    if(args.includes('all')){
        types = ['views', 'controllers', 'templates', 'stages', 'images'];
    }   
    const res = purge(types);
    if(!res.length){
        console.log('Info: nothing to purge');
    }else{
        const { exec } = require('child_process');
        const chalk = require('chalk');
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });  
        const q = 'Purge '+JSON.stringify(res)+'? Type '+chalk.green('[Y]ES')+' to proceed : ';
        rl.question(q, function (__res) {   
            if(['YES', 'Y'].includes(__res.toUpperCase())){
                console.log('Info: purging', res.length, 'items');
                var n;
                for(let i = 0; i < res.length; i++){   
                    console.log('Info: purging', res[i]);
                    n = res[i].split('.')[1];       
                    if(res[i].indexOf('www/html') !== -1){                   
                        exec('ogx delete template '+n);
                    }else{
                        if(res[i].indexOf('www/js/views') !== -1){
                            exec('ogx delete view '+n);
                        }else{
                            if(res[i].indexOf('www/js/stages') !== -1){
                                exec('ogx delete stage '+n);
                            }else{
                                if(res[i].indexOf('www/js/controllers') !== -1){
                                    exec('ogx delete controller '+n);
                                }else{
                                    if(res[i].indexOf('www/img') !== -1){
                                        fs.unlinkSync(res[i]);
                                    }
                                }
                            }
                        }
                    }
                };
                console.log('Info: purging done');
            }
            rl.close();   
        });  
    }  

    function purge(__types){
        let config = fs.readFileSync('www/app.json', 'utf-8');
        config = JSON.parse(config);
        delete config.preload;
        config = JSON.stringify(config);
        let purge = [];
        let reg, i, j, files, file, name, path;
        for(i = 0; i < __types.length; i++){
            switch(__types[i]){
                case 'templates':
                path = 'www/html';                
                break;

                case 'images':
                path = 'www/img';                
                break;

                default:
                path = 'www/js/'+__types[i];
            }
            files = fs.readdirSync(path);             
            for(j = 0; j < files.length; j++){
                in_use = false;  
                file = files[j];                     
                name = file.split('.')[1];
                switch(__types[i]){
                    case 'templates':
                    reg = new RegExp('template["\': ]*'+name+'["\' ]+', 'gi');          
                    break;

                    case 'images':
                    reg = new RegExp(file.replace('.', '\\.'), 'gi');   
                    break;

                    default:
                    reg = new RegExp(__types[i].substr(0, 1).toUpperCase()+__types[i].substr(1)+'.'+name, 'gi');
                } 
                if(testApp(config, reg)){
                    in_use = true;
                }
                if(!in_use && testOML(reg)){
                    in_use = true;
                }
                if(!in_use && testJSON(reg)){
                    in_use = true;
                }  
                if(!in_use && testJSbin(reg)){
                    in_use = true;
                }
                if(!in_use && testViews(reg)){
                    in_use = true;
                }  
                if(!in_use && testStages(reg)){
                    in_use = true;
                }  
                if(!in_use && testControllers(reg)){
                    in_use = true;
                }   
                if(!in_use && __types[i] === 'images' && testCSS(reg)){
                    in_use = true;
                }
                if(!in_use){
                    purge.push(path+'/'+files[j]);
                }      
            }
        } 
        return purge;  
    }   
    
    function testApp(__config, __reg){
        return __reg.test(__config);          
    }

    function testOML(__reg){
        const files = fs.readdirSync('www/oml');
        for(let i = 0; i < files.length; i++){
            oml = files[i];
            oml = fs.readFileSync('www/oml/'+oml, 'utf-8');
            if(__reg.test(oml)){
                return true;
            }
        };
        return false;
    }

    function testJSON(__reg){
        const files = fs.readdirSync('www/json');
        let json;
        for(let i = 0; i < files.length; i++){
            json = files[i];
            json = fs.readFileSync('www/json/'+json, 'utf-8');
            if(__reg.test(json)){
                return true;
            }
        };
        return false;
    }

    function testJSbin(__reg){    
        const files = fs.readdirSync('www/js/bin');
        let file;
        for(let i = 0; i < files.length; i++){
            file = files[i];    
            file = fs.readFileSync('www/js/bin/'+file, 'utf-8');
            if(__reg.test(file)){
                return true;
            }
        };
        return false;
    }


    function testViews(__reg){    
        const files = fs.readdirSync('www/js/views');
        let view;
        for(let i = 0; i < files.length; i++){
            view = files[i];    
            view = fs.readFileSync('www/js/views/'+view, 'utf-8');
            if(__reg.test(view)){
                return true;
            }
        };
        return false;
    }

    function testStages(__reg){
        const files = fs.readdirSync('www/js/stages');
        let stage;
        for(let i = 0; i < files.length; i++){
            stage = files[i];  
            stage = fs.readFileSync('www/js/stages/'+stage, 'utf-8');
            if(__reg.test(stage)){
                return true;
            }
        };
        return false;
    }

    function testControllers(__reg){
        const files = fs.readdirSync('www/js/controllers');
        let controller;
        for(let i = 0; i < files.length; i++){
            controller = files[i];  
            controller = fs.readFileSync('www/js/controllers/'+controller, 'utf-8');
            if(__reg.test(controller)){
                return true;
            }
        };  
        return false;
    }

    function testCSS(__reg){
        const paths = ['www/css/bin', 'www/css/stages', 'www/css/views'];
        let files, file, i, j;
        for(i = 0; i < paths.length; i++){    
            files = fs.readdirSync(paths[i]);
            for(j = 0; j < files.length; j++){
                file = files[j];  
                file = fs.readFileSync(paths[i]+'/'+file, 'utf-8');
                if(__reg.test(file)){
                    return true;
                }
            }
        };
        return false;       
    }
}