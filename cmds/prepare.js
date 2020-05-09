#!/usr/bin/env node

module.exports = (args) => {  
    console.log('Info: preparing...');
    require('./unlink.js')(['all'].concat(args));
    require('./fonts.js')(args);
    require('./images.js')(args);
    require('./jsons.js')(args);
    require('./omls.js')(args);
    require('./oses.js')(args);
    require('./sounds.js')(args);
    require('./templates.js')(args);
    require('./link.js')(['all'].concat(args));
    console.log('Info: prepare done!');
};