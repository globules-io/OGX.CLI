#!/usr/bin/env node

module.exports = (args) => {       
    if(args.length < 2){
        console.log('Error: Command unset requires a property !');
        return;
    }
    const fs = require('fs');
    let options = args[args.length-1];
    if(args[0] !== 'index'){        
        delete options[args[0]];              
        fs.writeFileSync('cli.json', JSON.stringify(options));
    }
};