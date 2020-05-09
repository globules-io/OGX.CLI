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
            fs.readdirSync('www/css/bin').forEach(file => {                    
                if(index.indexOf('<link rel="stylesheet" href="css/bin/'+file+'">\n</head>') === -1){
                    index = index.replace('</head>', '<link rel="stylesheet" href="css/bin/'+file+'">\n</head>');                         
                }
                console.log('Info: linked', file);               
            });          
            fs.writeFileSync('www/'+index_file, index);    
        }else{
            console.log('Warning:', index_file, 'file not found, linking skipped');
        } 
    }
};