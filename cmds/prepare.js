#!/usr/bin/env node
module.exports = (args) => {     
    const fs = require('fs');
    let options = {};
    let env;
    if(args.length){
        options = args[args.length-1];
    }
    if(options.hasOwnProperty('env')){
        env = options.env;
    }else{
        env = 'dev';
    }
    require('./unlink.js')(['all'].concat(args));
    //clear app.json
    if(args[0] === 'clear'){
        console.log('Info: clearing preload...');
        config = fs.readFileSync('www/app.json', 'utf-8');
        if(config){
            config = JSON.parse(config);
            if(config.hasOwnProperty('preload')){
                config.preload = {};
                fs.writeFileSync('www/app.json', JSON.stringify(config, null, 4));       
            } 
            console.log('Info: clearing done!');
        }
        return;
    }    
    //skip
    console.log('Info: preparing...');
    const calls = ['fonts', 'images', 'jsons', 'omls', 'oses', 'sounds', 'templates'];
    let skip = [];   
    if(args[0] === 'skip'){
        skip = Array.prototype.slice.call(args, 1, args.length -1);
        //ogx prepare skip [] --save
        let idx = skip.indexOf('--save');
        if(idx !== -1){
            skip = skip.splice(0, idx);
            options.prepare_skip = skip;
            fs.writeFileSync('ogx_cli.json', JSON.stringify(options));       
        }
        //ogx prepare skip --reset
        idx = skip.indexOf('--reset');
        if(idx !== -1){
            skip = [];
            if(options.hasOwnProperty('prepare_skip')){
                delete options.prepare_skip;
            }
            fs.writeFileSync('ogx_cli.json', JSON.stringify(options));       
        }
    }else{
        if(options.hasOwnProperty('prepare_skip')){
            skip = options.prepare_skip;
        }
    }     

    for(let i = 0; i < calls.length; i++){
        if(!skip.includes(calls[i])){
            require('./'+calls[i]+'.js')(args);
        }else{
            console.log('Info: prepare skip', calls[i]);
        }
    }    
    require('./link.js')(['all'].concat(args));
    require('./'+env+'.js')([options]);
    console.log('Info: prepare done!');      
};