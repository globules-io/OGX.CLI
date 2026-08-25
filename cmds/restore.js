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
    let folders = ['css/bin', 'css/views', 'css/stages'];
    for(let i = 0; i < folders.length; i++){
        if(fs.existsSync('ogx/backup/'+folders[i])){   
            if(!fs.existsSync('www/'+folders[i])){
                fs.mkdirSync('www/'+folders[i], {recursive:true});
            }   
            fs.readdirSync('ogx/backup/'+folders[i]).forEach(file => {                          
                fs.copyFileSync('ogx/backup/'+folders[i]+'/'+file, 'www/'+folders[i]+'/'+file);
                if(index){
                    //remove link from index.html      
                    index = index.replace('</head>', '<link rel="stylesheet" href="'+folders[i]+'/'+file+'">\n</head>');
                }                         
            }); 
        }       
    }

     console.log('Info: Restoring js files'); 
     folders = ['js/bin', 'js/views', 'js/controllers', 'js/stages']; 
     for(i = 0; i < folders.length; i++){                 
          if(fs.existsSync('ogx/backup/'+folders[i])){   
               if(!fs.existsSync('www/'+folders[i])){
                    fs.mkdirSync('www/'+folders[i], {recursive:true});
               }          
               fs.readdirSync('ogx/backup/'+folders[i]).forEach(file => {   
                    if(!file.includes('.min.js')){               
                         fs.copyFileSync('ogx/backup/'+folders[i]+'/'+file, 'www/'+folders[i]+'/'+file);  
                         index = index.replace('</head>', '<script type="application/javascript" src="'+''+folders[i]+'/'+file+'"></script>\n</head>');                        
                    }
               });   
          }       
     }    

     console.log('Info: Restoring json files');   
     folders = ['oml', 'json']; 
     for(i = 0; i < folders.length; i++){                 
          if(fs.existsSync('ogx/backup/'+folders[i])){   
               if(!fs.existsSync('www/'+folders[i])){
                    fs.mkdirSync('www/'+folders[i], {recursive:true});
               } 
               fs.readdirSync('ogx/backup/'+folders[i]).forEach(file => {                          
                    fs.copyFileSync('ogx/backup/'+folders[i]+'/'+file, 'www/'+folders[i]+'/'+file);
               });
          }       
     }   
     if(fs.existsSync('www/app.json')){
          fs.unlinkSync('www/app.json');
     }
     fs.copyFileSync('ogx/backup/app.json', 'www/app.json');

     console.log('Info: Restoring html files');   
     if(fs.existsSync('ogx/backup/html')){   
          if(!fs.existsSync('www/html')){
               fs.mkdirSync('www/html', {recursive:true});
          } 
          fs.readdirSync('ogx/backup/html').forEach(file => {                          
               fs.copyFileSync('ogx/backup/html/'+file, 'www/html/'+file);
          });
     }   

     if(index){       
          index = index.replace(/<script (.*)js\/min\/(.+)><\/script>(\r\n|\r|\n)*/gim, '');  
          index = index.replace(/<link (.*)css\/min\/(.+)>(\r\n|\r|\n)*/gim, '');  
          fs.writeFileSync('www/'+options.index, index);
     }

     console.log('Info: Cleaning up');    
     if(fs.existsSync('www/js/min/min.js')){
          fs.unlinkSync('www/js/min/min.js');
     }
     if(fs.existsSync('www/js/min/bin.js')){
          fs.unlinkSync('www/js/min/bin.js');
     }
     fs.rmSync('www/js/min', {recursive:true});
     
     if(fs.existsSync('www/css/min/min.css')){
          fs.unlinkSync('www/css/min/min.css');
          fs.rmSync('www/css/min', {recursive:true});
     }

     if(fs.existsSync('www/oml/oml.pak')){
          fs.unlinkSync('www/oml/oml.pak');
     }
     if(fs.existsSync('www/json/json.pak')){
          fs.unlinkSync('www/json/json.pak');
     }
     if(fs.existsSync('www/html/html.pak')){
          fs.unlinkSync('www/html/html.pak');
     }

     fs.rmSync('ogx/backup', {recursive:true});
     require('./dev.js')([options]);
};