#!/usr/bin/env node

module.exports = (args) => {
    console.log('Info: restore build files');  
    //decrypt
    if(args.length === 3){   
        require('./decrypt.js')([args[0]].concat([args[args.length-1]]));
    }
    require('./restore.js')([args[args.length-1]]);
    require('./unpack.js')(['all'].concat([args[args.length-1]]));
    require('./prepare.js')([args[args.length-1]]);   
    console.log('Info: build files restored !');      
}