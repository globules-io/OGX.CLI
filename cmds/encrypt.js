#!/usr/bin/env node

module.exports = (args) => {
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [key]');
        return;
    }
    const key = args[0];
    const aes256 = require('aes256');
    const fs = require('fs');
    let conf = fs.readFileSync('www/app.json', 'utf-8');
    if(conf){
        conf = aes256.encrypt(key, conf);
        fs.writeFileSync('www/app.json', conf);   
        console.log('Info: app.json has been encrypted'); 
    }
};