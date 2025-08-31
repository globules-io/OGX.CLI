#!/usr/bin/env node

let args = process.argv.slice(2);
let cmd = args.shift();
if(/(init|update|log|set|unset|create|delete|rename|version|help|images|sounds|omls|oses|jsons|templates|fonts|link|unlink|compress|restore|encrypt|decrypt|prepare|build|deploy|dev|prod|pack|unpack|purge|builder|open|css|copy)/gi.test(cmd)){
    const fs = require('fs');
    let options = null;

    //deprecation
    if(fs.existsSync('cli.json')){
        console.log('OGX.CLI cli.json deprecated, renamed to ogx_cli.json');
        fs.renameSync('cli.json', 'ogx_cli.json');
    }

    if(fs.existsSync('ogx_cli.json')){
        options = JSON.parse(fs.readFileSync('ogx_cli.json'));
    }else{
        options = {index:'index.html'};
        fs.writeFileSync('ogx_cli.json', JSON.stringify(options));
    }
    require('../cmds/'+cmd+'.js')(args.concat([options]));
}else{
    console.log('Invalid Command!');
}
module.exports = () => {};