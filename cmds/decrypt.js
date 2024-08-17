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
        conf = CryptoJS.AES.decrypt(conf, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
        //remove ejs
        let json = JSON.parse(conf);
        if(json.preload.hasOwnProperty('/ejs')){
            delete json.preload['/ejs'];
            conf = JSON.stringify(json);
        }     
        if(fs.existsSync('www/js/min/min.ejs')){
            fs.unlinkSync('www/js/min/min.ejs');
        }
        fs.writeFileSync('www/app.json', conf);   
        console.log('Info: app.json has been decrypted'); 

        //list pak files and encrypt them
        let dec = 0;
        const folders = ['html', 'json', 'oml'];
        folders.forEach((__folder) => {
            fs.readdirSync('www/'+__folder).forEach(__file => {    
                if(/\.pak$/.test(__file)){              
                    let text = fs.readFileSync('www/'+__folder+'/'+__file, 'utf-8');
                    text = CryptoJS.AES.decrypt(text, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);;
                    fs.writeFileSync('www/'+__folder+'/'+__file, text);
                    dec++;
                }
            });
        });

        if(dec){
            console.log('Info: '+dec+' pak files decrypted'); 
        }
        
    }
};