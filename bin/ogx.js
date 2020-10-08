#!/usr/bin/env node

let args = process.argv.slice(2);
let cmd = args.shift();
if(/(init|log|set|unset|create|delete|version|help|images|sounds|omls|oses|jsons|templates|fonts|link|unlink|compress|restore|prepare|build|deploy|dev|prod)/gi.test(cmd)){
    const fs = require('fs');
    let options = null;
    if(fs.existsSync('cli.json')){
        options = JSON.parse(fs.readFileSync('cli.json'));
    }else{
        options = {index:'index.html'};
        fs.writeFileSync('cli.json', JSON.stringify(options));
    }
    require('../cmds/'+cmd+'.js')(args.concat([options]));
}else{
    console.log('Invalid Command!');
}
module.exports = () => {};