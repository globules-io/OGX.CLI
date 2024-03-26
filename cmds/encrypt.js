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
        conf = CryptoJS.AES.encrypt(conf, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString();
        fs.writeFileSync('www/app.json', conf);   
        console.log('Info: app.json has been encrypted'); 

        //list pak files and encrypt them
        let enc = 0;
        const folders = ['html', 'json', 'oml'];
        folders.forEach((__folder) => {
            fs.readdirSync('www/'+__folder).forEach(__file => {    
                if(/\.pak$/.test(__file)){              
                    let text = fs.readFileSync('www/'+__folder+'/'+__file, 'utf-8');
                    text = CryptoJS.AES.encrypt(text, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString();
                    fs.writeFileSync('www/'+__folder+'/'+__file, text);
                    enc++;
                }
            });
        });
        if(enc){
            console.log('Info: '+enc+' pak files encrypted'); 
        }
    }    
};