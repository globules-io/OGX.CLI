#!/usr/bin/env node

module.exports = (args) => {
    console.log('Info: restore build files');     
    require('./restore.js')([args[args.length-1]]);
    require('./prepare.js')([args[args.length-1]]);   
    console.log('Info: build files restored !');      
}