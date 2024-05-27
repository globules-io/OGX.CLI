#!/usr/bin/env node

module.exports = (args) => {
    console.log('Info: building release!');      
    require('./prepare.js')([args[args.length-1]]); 
    require('./pack.js')(['all'].concat([args[args.length-1]]));    
    require('./compress.js')([args[args.length-1]]);
    //encrypt
    if(args.length === 3){        
        require('./encrypt.js')([args[1]].concat([args[args.length-1]]));
    }
    console.log('Info: release built!');  
}