#!/usr/bin/env node

module.exports = (args) => {
    
    const cv = require('compare-versions');
    const cmd = require('node-cmd');
    const chalk = require('chalk');
    const cmd_dir = process.cwd();    

    //CLI
    const { version } = require('../package.json');
    let o = cmd.runSync('npm show @globules-io/ogx.cli version');
    let latest = o.data.split('\n').shift();
    if(cv(latest, version) === 1){
        console.log(chalk.green('Info: OGX.CLI Update Available!'));
        console.log('Installed : OGX.CLI', chalk.blue(version));
        console.log('Latest    : OGX.CLI', chalk.green(latest));    
    }else{
        console.log('Installed : OGX.CLI', chalk.blue(version));
        console.log('Latest    : OGX.CLI', chalk.blue(latest));    
    }  

    //OGX
    let pkg = require(cmd_dir+'/package.json');
    let v;
    o = cmd.runSync('npm show @globules-io/ogx.js version');
    latest = o.data.split('\n').shift();
    if(pkg.dependencies.hasOwnProperty('@globules-io/ogx.js')){
        v = pkg.dependencies['@globules-io/ogx.js'].substr(1);
        if(cv(latest, v) === 1){
            console.log(chalk.green('Info: OGX.JS Update Available!'));
            console.log('Installed : OGX.JS', chalk.blue(v));
            console.log('Latest    : OGX.JS', chalk.green(latest));    
        }else{
            console.log('Installed : OGX.JS', chalk.blue(v));
            console.log('Latest    : OGX.JS', chalk.blue(latest));    
        }  
    }else{
        console.log('Status : Not installed');
        console.log('Latest : OGX.JS', chalk.blue(latest));    
    }    
}