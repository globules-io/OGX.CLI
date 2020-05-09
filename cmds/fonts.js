#!/usr/bin/env node
/*
expected [name]-[type].[ext], ie roboto-regular.tff
*/
module.exports = (args) => {
    const fs = require('fs');
    const path = 'www/fonts';
    let files = [];
    const reg = /(\.ttf|\.eot|\.woff|\.woff2)/gi;
    let output = '';
    let font;
    config = fs.readFileSync('www/app.json', 'utf-8');
    if(config){
        config = JSON.parse(config);
        if(config.hasOwnProperty('preload')){
            if(config.preload.hasOwnProperty('/fonts')){
                delete config.preload['/fonts'];
            }                  
        } 
        if(fs.existsSync(path)){         
            fs.readdirSync(path).forEach(folder => {  
                fs.readdirSync(path+'/'+folder).forEach(file => {
                    if(reg.test(file)){
                        font = file.split('.')[0].split('=');
                        output += '@font-face {\n';
                        output += '    font-family:'+font[0]+';\n';
                        output += '    src:url("../../fonts/'+folder+'/'+file+'");\n';
                        output += '}\n';
                        files.push(file);
                        console.log('Info: added to preload', file);
                    }
                });            
            });
            if(output.length){
                config.preload['/fonts'] = files;
                fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));
                if(fs.existsSync('www/css/bin/fonts.css')){
                    fs.unlinkSync('www/css/bin/fonts.css');
                }
                if(!fs.existsSync('www/css/bin')){
                    fs.mkdirSync('www/css/bin', {recursive:true});
                }
                fs.writeFileSync('www/css/bin/fonts.css', output);
                if(fs.existsSync('www/index.html')){
                    let index = fs.readFileSync('www/index.html', 'utf8');
                    if(index.indexOf('<link href="css/bin/fonts.css" rel="stylesheet" type="text/css">') === -1){
                        index = index.replace('</head>', '<link href="css/bin/fonts.css" rel="stylesheet" type="text/css">\n</head>');
                        fs.writeFileSync('www/index.html', index);
                    }
                }
            }
        }else{
            console.log('Warning: folder does not exist', 'www/css');
        }
    }else{
        console.log('Warning: app.json file not found, preload skipped');
    }
};