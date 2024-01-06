#!/usr/bin/env node
module.exports = (args) => {    
    if(!args || args.length < 2){
        console.log('Error: Missing arguments! Expected [name] or [type] [name]');
        return;
    }
    console.log('Info: Opening files');
    const exec = require('child_process').execSync;
    const fs = require('fs');

    let name;
    let type = null;
    let lookup_all = args.length === 2;
    lookup_all ? name = args[0] : [name, type] = [args[1], args[0]];

    if(lookup_all || type === 'js'){
        lookupViewJS(name);
    }

    if(lookup_all || type === 'css'){
        lookupViewCSS(name);
    }

    if(lookup_all || type === 'html'){
        lookupViewHTML(name);
    }  

    if(lookup_all || type === 'oml'){
        lookupViewOML(name);
    }   

    if(type === 'json'){
        lookupJSON(__name);
    }

    //lookup view js
    function lookupViewJS(__name){
        fs.readdirSync('www/js/views').forEach(file => {
            if(file.toLowerCase() === 'view.'+__name.toLowerCase()+'.js'){
                console.log('Info: Found js view', file);
                openFile('www/js/views', file);
            }
        });
    }

    //lookup view css
    function lookupViewCSS(__name){
        fs.readdirSync('www/css/views').forEach(file => {
            if(file.toLowerCase() === 'view.'+__name.toLowerCase()+'.css'){
                console.log('Info: Found css view', file);
                openFile('www/css/views', file);
            }
        });
    }

    //lookup template
    function lookupViewHTML(__name){
        fs.readdirSync('www/html').forEach(file => {
            if(file.toLowerCase() === 'template.'+__name.toLowerCase()+'.html'){
                console.log('Info: Found template', file);
                openFile('www/html', file);
            }
        });
    }

    //lookup oml
    function lookupViewOML(__name){
        fs.readdirSync('www/oml').forEach(file => {
            if(file.toLowerCase() === __name.toLowerCase()+'.oml'){
                console.log('Info: Found oml', file);
                openFile('www/oml', file);
            }
        });
    }    

    //lookup json
    function lookupJSON(__name){
        fs.readdirSync('www/json').forEach(file => {
            if(file.toLowerCase() === __name.toLowerCase()+'.json'){
                console.log('Info: Found json', file);
                openFile('www/json', file);
            }
        });
    }  

    function openFile(__path, __file){
        let com = 'code -r '+__file;
        exec(com, {cwd: __path});
    }
    
}