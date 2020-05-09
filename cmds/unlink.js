#!/usr/bin/env node

module.exports = (args) => {
    if(!args || !args.length){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(all|views|templates|stages)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }    
    if(args.length){
        const fs = require('fs');
        let options = args[args.length-1];
        let index = fs.readFileSync('www/'+options.index, 'utf-8');
        if(index){
            if(['all', 'views'].indexOf(args[0] !== -1)){               
                fs.readdirSync('www/js/views').forEach(file => {                  
                    index = index.replace('<script type="application/javascript" src="js/views/'+file+'"></script>\n', '');  
                    index = index.replace('<link rel="stylesheet" href="css/views/view.'+file.split('.')[1]+'.css">\n', ''); 
                    console.log('Info: unlinked', file);
                });
            }            
            if(['all', 'stages'].indexOf(args[0] !== -1)){   
                fs.readdirSync('www/js/stages').forEach(file => {                  
                    index = index.replace('<script type="application/javascript" src="js/stages/'+file+'"></script>\n', '');  
                    index = index.replace('<link rel="stylesheet" href="css/stages/stage.'+file.split('.')[1]+'.css">\n', ''); 
                    console.log('Info: linked', file);
                });       
            }   
            fs.writeFileSync('www/'+options.index, index);    
        }else{
            console.log('Warning: index.html file not found, unlink skipped');
        } 
    }
};