#!/usr/bin/env node

module.exports = (args) => {
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [key]');
        return;
    }
    const key = args[0];   
    //flag --js
    let js_files = (args.length > 1 && args[1] === '--js');        
    const fs = require('fs');
    let conf = fs.readFileSync('www/app.json', 'utf-8');
    if(conf){
        if(js_files){
            //add flag to config OGX.JS 1.41.0+
            let json = JSON.parse(conf);
            json.preload['/js/min'] = ['min.ejs'];
            conf = JSON.stringify(json);
        }
        const CryptoJS = require('crypto-js');
        conf = CryptoJS.AES.encrypt(conf, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString();
        fs.writeFileSync('www/app.json', conf);   
        console.log('Info: app.json has been encrypted'); 

        //list pak files and encrypt them
        let enc = 0;
        let folders = ['html', 'json', 'oml'];         
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

        //merge and pack js user files : compress needs to compress the folders into min/min.ejs instead (2 files)
        if(js_files){
            console.log('Info: encrypting js files');  
            let options = args[args.length-1];

            //no bin in this
            let js = fs.readFileSync('www/js/min/min.js', 'utf-8');
            js = CryptoJS.AES.encrypt(js, key, {mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7}).toString();
            fs.writeFileSync('www/js/min/min.ejs', js);      
            fs.unlinkSync('www/js/min/min.js');   
            let index_file = args[args.length-1].index;
            let index = fs.readFileSync('www/'+index_file, 'utf-8');
            index = index.replace(/<script (.*)js\/min\/min\.js><\/script>(\r\n|\r|\n)*/gim, '');
            fs.writeFileSync('www/'+options.index, index); 
            console.log('Info: js files encrypted'); 
        }       
    }    
};