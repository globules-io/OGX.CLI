#!/usr/bin/env node

module.exports = (args) => {  
    console.log('Info: preparing...');
    let options = args[args.length-1];
    let env;
    if(options.hasOwnProperty('env')){
        env = options.env;
    }else{
        env = 'dev';
    }
    require('./unlink.js')(['all'].concat(args));
    require('./fonts.js')(args);
    require('./images.js')(args);
    require('./jsons.js')(args);
    require('./omls.js')(args);
    require('./oses.js')(args);
    require('./sounds.js')(args);
    require('./templates.js')(args);
    require('./link.js')(['all'].concat(args));
    require('./'+env+'.js')([options]);
    console.log('Info: prepare done!');
};