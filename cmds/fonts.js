#!/usr/bin/env node
/*
expected [name]-[type].[ext], ie roboto-regular.tff
*/
module.exports = (args) => {
    const fs = require('fs');
    const paths = ['fonts'];
    let files = [];
    const reg = /(\.ttf|\.eot|\.woff|\.woff2)$/gi;
    let output = '';
    let font;
    let options = args[args.length-1];
    config = fs.readFileSync('www/app.json', 'utf-8');
    if(config){
        config = JSON.parse(config);
        if(config.hasOwnProperty('preload')){
            if(config.preload.hasOwnProperty('/fonts')){
                delete config.preload['/fonts'];
            }                  
        } 
        //merge with themes
        if(fs.existsSync('www/themes')){
            fs.readdirSync('www/themes').forEach(folder => {  
                if(fs.existsSync('www/themes/'+folder+'/base/fonts')){
                    paths.push('themes/'+folder+'/base/fonts');
                }
            });
        }
        for(let i = 0; i < paths.length; i++){           
            if(fs.existsSync('www/'+paths[i])){       
                files = [];  
                fs.readdirSync('www/'+paths[i]).forEach(folder => {  
                    fs.readdirSync('www/'+paths[i]+'/'+folder).forEach(file => {
                        if(reg.test(file) && !files.includes(file)){
                            font = file.split('.')[0].split('=');
                            output += '@font-face {\n';
                            output += '    font-family:'+font[0]+';\n';
                            output += '    src:url("../../'+paths[i]+'/'+folder+'/'+file+'");\n';
                            output += '}\n';
                            files.push(file);
                            console.log('Info: added to preload', file);
                            reg.lastIndex = 0;
                        }
                    });            
                });
                if(files.length){
                    if(config.hasOwnProperty('preload')){
                        if(config.preload.hasOwnProperty(paths[i])){
                            delete config.preload[paths[i]];
                        }                  
                    } 
                    config.preload[paths[i]] = files;
                }
            }
        }
        if(output.length){            
            fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
            if(fs.existsSync('www/css/bin/fonts.css')){
                fs.unlinkSync('www/css/bin/fonts.css');
            }
            if(!fs.existsSync('www/css/bin')){
                fs.mkdirSync('www/css/bin', {recursive:true});
            }
            fs.writeFileSync('www/css/bin/fonts.css', output);               
            if(fs.existsSync('www/'+options.index)){
                let index = fs.readFileSync('www/'+options.index, 'utf8');
                if(!index.includes('<link href="css/bin/fonts.css" rel="stylesheet" type="text/css">')){
                    index = index.replace('</head>', '<link href="css/bin/fonts.css" rel="stylesheet" type="text/css">\n</head>');
                    fs.writeFileSync('www/'+options.index, index);
                }
            }            
        }     
    }else{
        console.log('Warning: app.json file not found, preload skipped');
    }
};