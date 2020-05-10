#!/usr/bin/env node

module.exports = (args) => {
    if(!args || !args.length){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(all|views|controllers|stages|css|js)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }    
    if(args.length){
        const fs = require('fs');
        let options = args[args.length-1];
        let index = fs.readFileSync('www/'+options.index, 'utf-8');
        if(index){
            if(['all', 'controllers'].indexOf(args[0]) !== -1){               
                fs.readdirSync('www/js/controllers').forEach(file => {                  
                    index = index.replace('<script type="application/javascript" src="js/controllers/'+file+'"></script>\n', '');  
                    console.log('Info: unlinked', file);
                });
            }   
            if(['all', 'views'].indexOf(args[0]) !== -1){               
                fs.readdirSync('www/js/views').forEach(file => {                  
                    index = index.replace('<script type="application/javascript" src="js/views/'+file+'"></script>\n', '');  
                    index = index.replace('<link rel="stylesheet" href="css/views/view.'+file.split('.')[1]+'.css">\n', ''); 
                    console.log('Info: unlinked', file);
                });
            }            
            if(['all', 'stages'].indexOf(args[0]) !== -1){   
                fs.readdirSync('www/js/stages').forEach(file => {                  
                    index = index.replace('<script type="application/javascript" src="js/stages/'+file+'"></script>\n', '');  
                    index = index.replace('<link rel="stylesheet" href="css/stages/stage.'+file.split('.')[1]+'.css">\n', ''); 
                    console.log('Info: unlinked', file);
                });       
            }   
            if(['all', 'css'].indexOf(args[0]) !== -1){   
                fs.readdirSync('www/css/bin').forEach(file => {                  
                    index = index.replace('<link rel="stylesheet" href="css/bin/'+file+'">\n', '');  
                    console.log('Info: unlinked', file);
                });       
            }  
            if(['all', 'js'].indexOf(args[0]) !== -1){   
                fs.readdirSync('www/js/bin').forEach(file => {                  
                    index = index.replace('<script type="application/javascript" src="js/bin/'+file+'"></script>\n', '');  
                    console.log('Info: unlinked', file);
                });         
            }  
            fs.writeFileSync('www/'+options.index, index);    
        }else{
            console.log('Warning: index.html file not found, unlink skipped');
        } 
    }
};