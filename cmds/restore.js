#!/usr/bin/env node

module.exports = (args) => {    
    const fs = require('fs');

    if(!fs.existsSync('ogx')){
        console.log('Error: Not minified!');
        return;
    }
    let options = args[args.length-1];
    let index = fs.readFileSync('www/'+options.index, 'utf8');

    console.log('Info: Restoring css files');   
    const csss = ['css/bin', 'css/views', 'css/stages'];
    for(let i = 0; i < csss.length; i++){
        if(fs.existsSync('ogx/'+csss[i])){   
            if(!fs.existsSync('www/'+csss[i])){
                fs.mkdirSync('www/'+csss[i], {recursive:true});
            }   
            fs.readdirSync('ogx/'+csss[i]).forEach(file => {
                if(file.indexOf('__bundle.css') === -1){               
                    fs.copyFileSync('ogx/'+csss[i]+'/'+file, 'www/'+csss[i]+'/'+file);
                    if(index){
                        //remove link from index.html      
                        index = index.replace('</head>', '<link rel="stylesheet" href="'+csss[i]+'/'+file+'">\n</head>');
                    }
                }            
            }); 
        }       
    }

    console.log('Info: Restoring js files'); 
    const folders = ['js/bin', 'js/views', 'js/controllers', 'js/stages', 'css/bin', 'css/views', 'css/stages']; 
    for(i = 0; i < folders.length; i++){                 
        if(fs.existsSync('ogx/'+folders[i])){   
            if(!fs.existsSync('www/'+folders[i])){
                fs.mkdirSync('www/'+folders[i], {recursive:true});
            }          
            fs.readdirSync('ogx/'+folders[i]).forEach(file => {   
                if(file.indexOf('.min.js') === -1){               
                    fs.copyFileSync('ogx/'+folders[i]+'/'+file, 'www/'+folders[i]+'/'+file);
                    if(index){
                        //remove link from index.html      
                        index = index.replace('</head>', '<script type="application/javascript" src="'+''+folders[i]+'/'+file+'"></script>\n</head>');
                    }
                }
            });   
        }       
    }    

    if(index){       
        index = index.replace('<link rel="stylesheet" href="css/min.css">\n', '');
        index = index.replace('<script type="application/javascript" src="js/min.js"></script>\n', '');
        fs.writeFileSync('www/'+options.index, index);
    }

    console.log('Info: Cleaning up');    
    if(fs.existsSync('www/js/min/min.js')){
        fs.unlinkSync('www/js/min/min.js');
        fs.rmdirSync('www/js/min', {recursive:true});
    }
    if(fs.existsSync('www/css/min/.css')){
        fs.unlinkSync('www/css/min/min.css');
        fs.rmdirSync('www/css/min', {recursive:true});
    }
    fs.rmdirSync('ogx', {recursive:true});
};