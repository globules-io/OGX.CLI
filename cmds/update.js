#!/usr/bin/env node

module.exports = (args) => { 
    
    const cv = require('compare-versions');
    const cmd = require('node-cmd');
    const cmd_dir = process.cwd();   

    let pkg = require(cmd_dir+'/package.json');
    var version = false;
    o = cmd.runSync('npm show @globules-io/ogx.js version');
    latest = o.data.split('\n').shift();
    if(pkg && pkg.hasOwnProperty('dependendies') && pkg.dependencies.hasOwnProperty('@globules-io/ogx.js')){
        version = pkg.dependencies['@globules-io/ogx.js'].substr(1);        
    }   

    let install;

    //need --dev to down the latest dev build
    if(args.includes('--dev')){
        install = true;
        if(pkg && pkg.hasOwnProperty('dependendies')){
            if(pkg.dependencies.hasOwnProperty('@globules-io/ogx.js')){
                install = false;
                console.log('Info: installing OGX.JS DEV from Github');
                cmd.runSync('npm uninstall @globules-io/ogx.js');
                cmd.runSync('npm install https://github.com/globules-io/OGX.JS');
                console.log('Info: OGX.JS DEV from Github installed');                
            }
        }
        if(install){
            console.log('Info: installing OGX.JS DEV from Github');
            cmd.runSync('npm install @globules-io/ogx.js@'+latest);
            cmd.runSync('npm install https://github.com/globules-io/OGX.JS');
            console.log('Info: OGX.JS DEV from Github installed');   
        }
        return;
    }

    if(args.includes('--force') || (version && cv(latest, version) === 1) || !version){  
        install = true;
        if(pkg && pkg.hasOwnProperty('dependendies')){
            if(pkg.dependencies.hasOwnProperty('@globules-io/ogx.js')){
                install = false;
                console.log('Info: updating OGX.JS '+latest);
                cmd.runSync('npm uninstall @globules-io/ogx.js');
                cmd.runSync('npm install @globules-io/ogx.js@'+latest);
            }
        }
        if(install){
            console.log('Info: installing @globules-io/ogx.js@'+latest);
            cmd.runSync('npm install @globules-io/ogx.js@'+latest);
        }
    }else{
        console.log('Info: Latest version already installed.');
    }
};