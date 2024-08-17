#!/usr/bin/env node

module.exports = (args) => {
    console.log('Info: building release!');  
    require('./prepare.js')([args[args.length-1]]); 
    require('./pack.js')(['all'].concat([args[args.length-1]]));  

    //flag to compress for ejs --js
    let cargs = [];
    if(args.length === 3){
        cargs.push('ejs');
    }
    cargs.push(args[args.length-1])
    require('./compress.js')(cargs);

    //encrypt
    if(args.length === 3){    
        //missing flag
        const arg = args.slice();    
        arg.pop();
        require('./encrypt.js')(arg.concat([args[args.length-1]]));
    }
    console.log('Info: release built!');  
}