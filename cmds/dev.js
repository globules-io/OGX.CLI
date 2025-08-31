#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    let options = args[args.length-1];
    if(!options.hasOwnProperty('env') || options.env !== 'dev'){
        options.env = 'dev';
        fs.writeFileSync('ogx_cli.json', JSON.stringify(options));
        let index = fs.readFileSync('www/'+options.index, 'utf-8');
        if(index){
            index = index.replace('<script type="application/javascript" src="js/lib/globules/ogx.min.js"></script>', '<script type="application/javascript" src="js/lib/globules/ogx.dev.min.js"></script>');
            fs.writeFileSync('www/'+options.index, index); 
        }
    }
};