#!/usr/bin/env node

module.exports = (args) => {       
    if(args.length < 2){
        console.log('Error: Command set requires a property and a value!');
        return;
    }
    const fs = require('fs');
    let options = args[args.length-1];
    options[args[0]] = args[1];
    fs.writeFileSync('cli.json', JSON.stringify(options));
};