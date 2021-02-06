#!/usr/bin/env node

module.exports = (args) => {
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [key]');
        return;
    }
    const key = args[0];   
    const fs = require('fs'); 
    let conf = fs.readFileSync('www/app.json', 'utf-8');
    if(conf){
        const CryptoJS = require('crypto-js');
        conf = CryptoJS.AES.decrypt(conf, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);;
        fs.writeFileSync('www/app.json', conf);   
        console.log('Info: app.json has been decrypted'); 
    }
};