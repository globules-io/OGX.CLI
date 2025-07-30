#!/usr/bin/env node

module.exports = (args) => {
    console.log('Info: building release!');  
    let options = args[args.length-1];
    require('./prepare.js')([options]); 
    require('./pack.js')(['all'].concat([options]));  

    //flag to compress for ejs --js
    let cargs = [];
    if(args.length === 3){
        cargs.push('ejs');
    }
    cargs.push(args[args.length-1])
    require('./compress.js')(cargs);

    //encrypt
    if(args.length === 2){    
        //missing flag
        const arg = args.slice();    
        arg.pop(); 
        require('./encrypt.js')(arg.concat([options]));
    }
    require('./prod.js')([options]);
    console.log('Info: release built!');  
}