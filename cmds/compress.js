#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    const exec = require('child_process').execSync;
    const csso = require('csso');
    let files_to_delete = [];
    let folders_to_delete = [];
    
    if(fs.existsSync('ogx/js')){
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
    let to_compress = [];
    let to_merge = [];
    let files;
    for(let i = 0; i < folders.length; i++){
        if(!fs.existsSync('ogx/'+folders[i])){
            fs.mkdirSync('ogx/'+folders[i]);
        } 
        if(fs.existsSync('www/'+folders[i])){  
            files = 0;
            fs.readdirSync('www/'+folders[i]).forEach(file => {      
                files++;            
                fs.copyFileSync('www/'+folders[i]+'/'+file, 'ogx/'+folders[i]+'/'+file);
                files_to_delete.push('www/'+folders[i]+'/'+file);  
                if(index){
                    //remove link from index.html   
                    if(file.includes('.js')){
                        index = index.replace('<script type="application/javascript" src="'+folders[i]+'/'+file+'"></script>\n', '');     
                    }else{
                        if(file.includes('.css')){
                            index = index.replace('<link rel="stylesheet" href="'+folders[i]+'/'+file+'">\n', '');    
                        } 
                    }               
                }
            }); 
            if(files && folders[i].substr(0, 2) === 'js'){
                to_compress.push('uglifyjs-folder ogx/'+folders[i]+' -o ogx/js/min/'+folders[i].split('/').pop()+'.min.js');
                to_merge.push('ogx/js/min/'+folders[i].split('/').pop()+'.min.js');
            }  
        }
        if(fs.existsSync('www/'+folders[i])){
            folders_to_delete.push('www/'+folders[i]);           
        } 
    }   
    
    for(let i = 0; i < to_compress.length; i++){
        exec(to_compress[i]);
    };

    console.log('Info: Moving js files');    
    let str = '';
    let min;
    for(let i = 0; i < to_merge.length; i++){
        if(fs.existsSync(to_merge[i])){
            min = fs.readFileSync(to_merge[i], 'utf8');
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
    let css, stats; 
    for(i = 0; i < csss.length; i++){
        if(fs.existsSync('www/'+csss[i])){
            if(!fs.existsSync('ogx/'+csss[i])){
                fs.mkdirSync('ogx/'+csss[i]);
            } 
            fs.readdirSync('www/'+csss[i]).forEach(file => {
                fs.copyFileSync('www/'+csss[i]+'/'+file, 'ogx/'+csss[i]+'/'+file);
                files_to_delete.push('www/'+csss[i]+'/'+file);   
                //skip empty css files create from CLI
                stats = fs.statSync('ogx/'+csss[i]+'/'+file);
                if(stats.size){
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
                }else{
                    console.log('Warning: Skipping empty files', 'ogx/'+csss[i]+'/'+file);
                }                      
            });
        }          
        if(fs.existsSync('www/'+csss[i])){
            folders_to_delete.push('www/'+csss[i]);     
        }       
    }
    if(str.length){   
        const res = csso.minify(str);
        fs.writeFileSync('www/css/min/min.css', res.css); 
    }else{
        console.log('Warning: No css file to compress');    
    }

    console.log('Info: Cleaning up');  
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
                fs.rmSync(folders_to_delete[i], {recursive:true});     
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