#!/usr/bin/env node
module.exports = (args) => {    
    if(!args || args.length < 2){
        console.log('Error: Missing arguments! Expected [action] [builder]');
        return;
    }
    if(!/(add|remove)/gi.test(args[0])){
        console.log('Error: Invalid action!');
        return;
    }
    if(!/(cordova|neutralino)/gi.test(args[1])){
        console.log('Error: Invalid builder!');
        return;
    }
    const fs = require('fs');   
    const exec = require('child_process').execSync;
    let options = args[args.length-1];
    let index = fs.readFileSync('www/'+options.index, 'utf-8');
    if(index){ 
        if(args[0] === 'add'){
            switch(args[1]){
                case 'cordova':
                index = addCordova(index);
                break;

                case 'neutralino':
                index = addNeutralino(index);
                break;
            }
        }else if(args[0] === 'remove'){
            switch(args[1]){
                case 'cordova':
                index = removeCordova(index);
                break;

                case 'neutralino':
                index = removeNeutralino(index);
                break;
            }           
        }  
    } 
    if(index){
        fs.writeFileSync('www/'+options.index, index);
        console.log('Info: updated www/'+options.index);
        return;
    } 

    function addCordova(__index){
        if(__index.indexOf('<script type="application/javascript" src="cordova.js"></script>') !== -1){
            console.log('Error: Cordova already installed!');
            return false;
        }
        let idx = __index.indexOf('</title>')+8;
        __index = __index.slice(0, idx)+'\r\n'+'<script type="application\/javascript" src="cordova.js"><\/script>\r'+__index.slice(idx);       
        console.log('Info: linked Cordova related files');
        if(!fs.existsSync('config.xml')){
            let rp = require('path').resolve(__dirname, '../files/config.xml');
            fs.copyFileSync(rp, 'config.xml');
            console.log('Info: copied default config.xml');            
        }else{
            console.log('Info: config.xml already present');
        }
        return __index;
    }

    function removeCordova(__index){
        const reg = /<script type="application\/javascript" src="cordova.js"><\/script>(\r|\n)*/g;
        if(!__index.match(reg)){
            console.log('Error: Cordova not installed!');
            return false;
        }
        __index = __index.replace(reg, '');       
        return __index;
    }

    function addNeutralino(__index){   
        const script = '<script type="application/javascript" src="js/lib/neutralino/neutralino.js"></script>';   
        const config = 'neutralino.config.json';
        if(__index.indexOf(script) !== -1){
            console.log('Error: Neutralino already installed!');
            return false;
        }
        let idx = __index.indexOf('</title>')+8;
        __index = __index.slice(0, idx)+'\r\n'+script+__index.slice(idx);     
        if(!fs.existsSync(config)){
            let rp = require('path').resolve(__dirname, '../files/'+filename);
            fs.copyFileSync(rp, config);
            exec('neu update', function(error, stdout, stderr) {
                console.dir(stdout);
            });
        }
        return __index; 
    }

    function removeNeutralino(__index){        
        fs.rmdirSync('www/js/lib/neutralino', { recursive: true, force: true });
        const reg = /<script type="application\/javascript" src="js\/lib\/neutralino\/neutralino.js"><\/script>(\r|\n)*/g;
        __index = __index.replace(reg, '');
        return __index;
    }
};