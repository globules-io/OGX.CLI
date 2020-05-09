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
    let index_file = args[args.length-1].index;
    if(args.length){
        const fs = require('fs');
        let index = fs.readFileSync('www/'+index_file, 'utf-8');
        if(index){
            if(['all', 'views'].indexOf(args[0] !== -1)){               
                fs.readdirSync('www/js/views').forEach(file => {                  
                    index = index.replace('</head>', '<script type="application/javascript" src="js/views/'+file+'"></script>\n</head>');  
                    index = index.replace('</head>', '<link rel="stylesheet" href="css/views/view.'+file.split('.')[1]+'.css">\n</head>'); 
                    console.log('Info: linked', file);
                });
            } 
            if(['all', 'templates'].indexOf(args[0] !== -1)){     
                fs.readdirSync('www/html').forEach(file => {                  
                    index = index.replace('</head>', '<script type="application/javascript" src="html/'+file+'"></script>\n</head>');     
                    console.log('Info: linked', file);            
                });  
               
            }
            if(['all', 'stages'].indexOf(args[0] !== -1)){   
                fs.readdirSync('www/js/stages').forEach(file => {                  
                    index = index.replace('</head>', '<script type="application/javascript" src="js/stages/'+file+'"></script>\n</head>');  
                    index = index.replace('</head>', '<link rel="stylesheet" href="css/stages/stage.'+file.split('.')[1]+'.css">\n</head>'); 
                    console.log('Info: linked', file);
                });       
            }   
            fs.writeFileSync('www/'+index_file, index);    
        }else{
            console.log('Warning:', index_file, 'file not found, linking skipped');
        } 
    }
};