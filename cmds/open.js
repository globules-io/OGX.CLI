#!/usr/bin/env node
/*
D:\Server\ROOT\KRUBOSS_PWA\www\css\bin>code -r icons.css
*/
module.exports = (args) => {    
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [name]');
        return;
    }
    console.log('Info: Opening files');
    const exec = require('child_process').execSync;
    const fs = require('fs');
    const name = args[0];

    //lookup view js
    fs.readdirSync('www/js/views').forEach(file => {
        if(file.toLowerCase() === 'view.'+name.toLowerCase()+'.js'){
            console.log('Info: Found css view', file);
            openFile('www/js/views', file);
        }
    });

    //lookup view css
    fs.readdirSync('www/css/views').forEach(file => {
        if(file.toLowerCase() === 'view.'+name.toLowerCase()+'.css'){
            console.log('Info: Found js view', file);
            openFile('www/css/views', file);
        }
    });

    //lookup template
    fs.readdirSync('www/html').forEach(file => {
        if(file.toLowerCase() === 'template.'+name.toLowerCase()+'.html'){
            console.log('Info: Found template', file);
            openFile('www/html', file);
        }
    });

    //lookup oml
    fs.readdirSync('www/oml').forEach(file => {
        if(file.toLowerCase() === name.toLowerCase()+'.oml'){
            console.log('Info: Found oml', file);
            openFile('www/oml', file);
        }
    });
    

    function openFile(__path, __file){
        let com = 'code -r '+__file;
        exec(com, {cwd: __path});
    }
    
}