#!/usr/bin/env node

let args = process.argv.slice(2);
let cmd = args.shift();
if(/(create|delete|version|help|images|sounds|jsons|templates|fonts|link|unlink|compress|restore|build)/gi.test(cmd)){
    require('../cmds/'+cmd+'.js')(args);
}else{
    console.log('Invalid Command!');
}
module.exports = () => {};