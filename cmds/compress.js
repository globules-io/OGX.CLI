#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const exec = require('child_process').execSync;
    let files_to_delete = [];
    let folders_to_delete = [];
    
    if(fs.existsSync('ogx')){
        console.log('Error: Already minified!');
        return;
    }

    console.log('Info: Backing up files');
    if(!fs.existsSync('ogx')){
        fs.mkdirSync('ogx');
    }
    if(!fs.existsSync('ogx/js')){
        fs.mkdirSync('ogx/js');
    } 
    if(!fs.existsSync('ogx/css')){
        fs.mkdirSync('ogx/css');
    }   
    if(!fs.existsSync('www/js/min')){
        fs.mkdirSync('www/js/min');
    }
    if(!fs.existsSync('www/css/min')){
        fs.mkdirSync('www/css/min');
    }
    //back up files and remove link
    let options = args[args.length-1];
    let index = fs.readFileSync('www/'+options.index, 'utf8');

    const folders = ['js/bin', 'js/views', 'js/controllers', 'js/stages', 'css/bin', 'css/views', 'css/stages']; 
    for(let i = 0; i < folders.length; i++){
        if(!fs.existsSync('ogx/'+folders[i])){
            fs.mkdirSync('ogx/'+folders[i]);
        }           
        if(fs.existsSync('www/'+folders[i])){             
            fs.readdirSync('www/'+folders[i]).forEach(file => {                  
                fs.copyFileSync('www/'+folders[i]+'/'+file, 'ogx/'+folders[i]+'/'+file);
                files_to_delete.push('www/'+folders[i]+'/'+file);  
                if(index){
                    //remove link from index.html   
                    //bad, could be css here
                    if(file.indexOf('.js') !== -1){
                        index = index.replace('<script type="application/javascript" src="'+folders[i]+'/'+file+'"></script>\n', '');     
                    }else{
                        if(file.indexOf('.css') !== -1){
                            index = index.replace('<link rel="stylesheet" href="'+folders[i]+'/'+file+'">\n', '');    
                        } 
                    }               
                }
            });   
        }
        if(fs.existsSync('www/'+folders[i])){
            folders_to_delete.push('www/'+folders[i]);           
        } 
    }

    console.log('Info: Compressing js files');
    const calls = [
        'uglifyjs-folder ogx/js/views -o ogx/js/min/views.min.js',
        'uglifyjs-folder ogx/js/stages -o ogx/js/min/stages.min.js',
        'uglifyjs-folder ogx/js/controllers -o ogx/js/min/controllers.min.js',
        'uglifyjs-folder ogx/js/bin -o ogx/js/min/bin.min.js'
    ];
    
    for(let i = 0; i < calls.length; i++){
        exec(calls[i]);
    };

    console.log('Info: Moving js files');
    //should all be in one file in /js
    const jss = [
        'ogx/js/min/controllers.min.js',
        'ogx/js/min/views.min.js',
        'ogx/js/min/stages.min.js',
        'ogx/js/min/bin.min.js'
    ];
    let str = '';
    let min;
    for(let i = 0; i < jss.length; i++){
        if(fs.existsSync(jss[i])){
            min = fs.readFileSync(jss[i], 'utf8');
            if(min){            
                str += min+'\n';
            }
        }
    }
    if(str.length){
        fs.writeFileSync('www/js/min/min.js', str);
    }else{
        console.log('Warning: No js file to compress');    
    }

    console.log('Info: Compressing css files');    
    const csss = ['css/bin', 'css/views', 'css/stages'];
    str = '';
    let css; 
    for(i = 0; i < csss.length; i++){
        if(fs.existsSync('www/'+csss[i])){
            if(!fs.existsSync('ogx/'+csss[i])){
                fs.mkdirSync('ogx/'+csss[i]);
            } 
            fs.readdirSync('www/'+csss[i]).forEach(file => {
                fs.copyFileSync('www/'+csss[i]+'/'+file, 'ogx/'+csss[i]+'/'+file);
                files_to_delete.push('www/'+csss[i]+'/'+file);   
                css = fs.readFileSync('ogx/'+csss[i]+'/'+file, 'utf8');
                if(css){
                    str += css;                         
                    if(index){
                        //remove link from index.html      
                        index = index.replace('<link rel="stylesheet" href="'+csss[i]+'/'+file+'">\n', '');
                    }
                }else{
                    console.log('Error: Could not read file', 'ogx/'+csss[i]+'/'+file);
                    return;
                }                       
            });
        }          
        if(fs.existsSync('www/'+csss[i])){
            folders_to_delete.push('www/'+csss[i]);     
        }       
    }
    if(str.length){
        fs.writeFileSync('ogx/css/__bundle.css', str);
        exec('csso -i ogx/css/__bundle.css -o www/css/min/min.css');
    }else{
        console.log('Warning: No css file to compress');    
    }

    console.log('Info: Cleaning up');   
    if(str.length){
        fs.unlinkSync('ogx/css/__bundle.css');
    }
   
    if(files_to_delete.length){
        for(i = 0; i < files_to_delete.length; i++){
            if(fs.existsSync(files_to_delete[i])){
                fs.unlinkSync(files_to_delete[i]);     
            }
        } 
    }
    if(folders_to_delete.length){
        for(i = 0; i < folders_to_delete.length; i++){
            if(fs.existsSync(folders_to_delete[i])){
                fs.rmdirSync(folders_to_delete[i], {recursive:true});     
            }
        } 
    }
   
    if(index){
        index = index.replace('</head>', '<link rel="stylesheet" href="css/min/min.css">\n</head>');
        index = index.replace('</head>', '<script type="application/javascript" src="js/min/min.js"></script>\n</head>');       
        fs.writeFileSync('www/'+options.index, index);
    }

    console.log('Info: Compress success!'); 
};