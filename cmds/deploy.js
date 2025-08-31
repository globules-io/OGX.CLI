#!/usr/bin/env node

/*
ogx-deploy adb debug|release
ogx-deploy local d:/somefolder --save
ogx-deploy local
ogx-deploy ftp remote_dir username:password@ip_address:port --save => servername = 'default'
ogx-deploy ftp remote_dir username:password@ip_address:port --save servername
ogx-deploy ftp servername
ogx-deploy ftp => servername = 'default'
*/

const fs = require('fs');
module.exports = (args) => {
    const options = args.pop();
    if(!options.hasOwnProperty('deploy')){
        options.deploy = {targets:[], target:null, unix:0};
        saveOptions(options);
    }
    const config = options.deploy;

    let save = args.indexOf('--save');
    if(save === -1){
        save = false;
    }else{
        args.splice(save, 1);
        save = true;
    } 
    let save_results = true;  

    if(!args.length){
        console.log('Error: Command deploy requires method!');
        return;
    } 

    //android adb
    if(/(android)/gi.test(args[0])){    
        if(args.length < 2){
            console.log('Error: Command deploy requires a method and a build!');
            return;
        }   
        args[0] = 'adb';
        console.log('Deprecation: android has been deprecated for adb, please use "ogx deploy adb" instead');
    }

    //local
    //local d:/somefolder --save
    if(/(local)/gi.test(args[0])){      
        let target_name = null;
        let target = null;

        //ogx-deploy local : reuse 'default' local target
        if(args.length === 1){
            target_name = 'default';
            target = findTarget(config.targets, 'local', target_name);         
        } 

        //ogx-deploy local name : use name local target
        if(args.length === 2 && !isPath(args[1])){
            target_name = args[1];
            target = findTarget(config.targets, 'local', target_name);            
        }            

        //ogx-deploy local path (no save) : name vs path
        if(args.length === 2 && !save && isPath(args[1])){
            save_results = false;
            target_name = 'default';
            target = {type: 'local', name: target_name, path: args[1], failed: [], unix:0};  
        } 

        //ogx-deploy local path --save : save as 'default'
        if(args.length === 2 && save && isPath(args[1])){
            target_name = 'default';
            target = {type: 'local', name: target_name, path: args[1], failed: [], unix:0};     
            addTarget(config.targets, target);
            config.default = 'default';
            saveOptions(options);
        }

        //ogx-deploy local path --save name : save as name and use
        if(args.length === 4 && save && isPath(args[1])){
            target_name = args[3];
            target = {type: 'local', name: target_name, path: args[1], address: args[2], failed: [], unix:0};     
            addTarget(config.targets, target);
            config.default = 'default';
            saveOptions(options);
        }  

        if(!target){
            console.log('Error: Deploy LOCAL target not found');
            return;
        }         

        let modified_files = listModifiedFiles('', target.unix);
        if(!modified_files.length){
            console.log('Info: Nothing to deploy, no modified files found for target', target.name);
        }

        //merge failed and modified
        if(target.failed.length){
            console.log('Info: Deploy LOCAL previously failed files', target.failed.length);
            target.failed.forEach(__file => {
                if(!modified_files.includes(__file)){
                    modified_files.unshift(__file);
                }
            });            
        }

        console.log('Info: Deploy LOCAL to', target.path, modified_files);        

        localDeploy(target.path, modified_files, (__deployed, __failed) => {
            //save failed and will run at start of next deploy on this target, if files still exist
            if(__failed.length){
                console.log('Info: Deploy LOCAL failed files', __failed.length);
            }
            console.log('Info: Deploy LOCAL success files', __deployed.length);
            target.failed = __failed;
            target.unix = new Date().getTime();
            if(save_results){
                saveOptions(options);
            }
        });

        return;
    }

    //ftp
    //ftp test:test@127.0.0.1:21 /
    if(/(ftp)/gi.test(args[0])){        

        let target_name = null;
        let target = null;

        //ogx-deploy ftp : reuse 'default' ftp target
        if(args.length === 1){
            target_name = 'default';
            target = findTarget(config.targets, 'ftp', target_name);            
        }

        //ogx-deploy ftp name : use name ftp target
        if(args.length === 2){
            target_name = args[1];
            target = findTarget(config.targets, 'ftp', target_name);            
        }

        //ogx-deploy ftp  username:password@ip_address:port remote_dir --save : save as 'default'
        if(args.length === 3 && save){
            if(!/(.+):(.+)@(.*):(\d+)/gi.test(args[1])){
                console.log('Error: Deploy FTP configuration error');
                return;
            }
            target_name = 'default';
            target = {type: 'ftp', name: target_name, address:args[1], path:args[2], failed:[], unix:0};     
            addTarget(config.targets, target);
            config.default = 'default';
            saveOptions(options);
        }

        //ogx-deploy ftp username:password@ip_address:port remote_dir --save name : save as name and use
        if(args.length === 4 && save){
            target_name = args[3];
            target = {type: 'ftp', name: target_name, address:args[1], path:args[2], failed:[], unix:0};     
            addTarget(config.targets, target);
            config.default = 'default';
            saveOptions(options);
        }  

        if(!target){
            console.log('Error: Deploy FTP target not found');
            return;
        }         

        let modified_files = listModifiedFiles('', target.unix);
        if(!modified_files.length){
            console.log('Info: Deploy FTP modified files found for target', target.name);
        }

        console.log('Info: Deploy FTP to', target.address, target.path);

        //merge failed and modified
        if(target.failed.length){
            console.log('Info: Deploy FTP previously failed files', target.failed.length);
            target.failed.forEach(__file => {
                if(!modified_files.includes(__file)){
                    modified_files.push(__file);
                }
            });            
        }

        ftpDeploy(target.address, target.path, modified_files, (__deployed, __failed) => {
            if(!__deployed.length && !__failed.length){
                console.log('Info: Deploy FTP error');
                return;
            }
            //save failed and will run at start of next deploy on this target, if files still exist
            if(__failed.length){
                console.log('Info: Deploy FTP failed files', __failed.length);
            }
            console.log('Info: Deploy FTP success files', __deployed.length);
            target.failed = __failed;
            target.unix = new Date().getTime();
            if(save_results){
                saveOptions(options);
            }
        });
        
        return;
    }

    if(/(adb)/gi.test(args[0]) && /(debug|release)/gi.test(args[1])){       
        let com = false;
        switch(args[0]){
            case 'adb':
            console.log('Info: Deploying android build via ADB');
            com = 'cd platforms/android/app/build/outputs/apk/'+args[1]+' && adb install -r app-'+args[1]+'.apk'; 
            break;            
        }
        if(com){
            const exec = require('child_process').execSync;
            exec(com, function(error, stdout, stderr){
                console.dir(stdout);
            });  
            let stats = fs.statSync('platforms/android/app/build/outputs/apk/'+args[1]+'/app-'+args[1]+'.apk');
            console.log('Info: Build deployed, size '+Math.round(stats.size/1024)+' kb');
        }
        return;
    }
    
    console.log('Error: Command deploy requires a method!');        

    function saveOptions(__options){
        fs.writeFileSync('ogx_cli.json', JSON.stringify(__options, null, 4)); 
    }

    function isPath(__string){
        return (__string.match(/((^[a-z]+):)?\/?\\?/gi));
    }

    //www
    function listModifiedFiles(__dir, __unix){ 
        typeof __unix === 'undefined' ? __unix = new Date().getTime() : null;
        let stat, file_unix;      
        let files = [];
        //console.log('Deploy lookup modified files : www', __dir);
        fs.readdirSync('www' + __dir).forEach(__file => {             
            stat = fs.statSync('www' + __dir + '/' + __file);
            if(stat){
                file_unix = new Date(stat.mtime).getTime();
                //console.log('Discovered file', 'www' + __dir + '/' + __file, file_unix);
                if(stat.isFile() && file_unix > __unix){
                    console.log('Deploy lookup found new or modified file', 'www' + __dir + '/' + __file);
                    if(!files.includes( __dir + '/' + __file)){
                        files.push( __dir + '/' + __file);   
                    }
                }  
                if(stat.isDirectory()){            
                    arr = listModifiedFiles(__dir + '/' + __file, __unix);
                    if(arr.length){
                        files = files.concat(arr);
                    }   
                }                
            }                          
        });        
        return files;
    }    

    function addTarget(__targets, __target){
        for(let i = 0; i < __targets.length; i++){
            //overwrite
            if(__targets[i].type === __target.type && __targets[i].name === __target.name){
                __targets[i] = __target;
                return true;
            }
        }
        __targets.push(__target);
        return true;
    }

    function findTarget(__targets, __type, __name){
        for(let i = 0; i < __targets.length; i++){
            if(__targets[i].type === __type && __targets[i].name === __name){
                return __targets[i];
            }
        }
        return false;
    }

    function localDeploy(__path, __files, __cb){    
        let deployed = [];
        let failed = [];      
        __path = __path.replace(/\\\\|\\/, '/');
        console.log('Deploy destination path', __path);   

        let local_path, remote_path, remote_dir;
        __files.forEach(__file => {     
            local_path = 'www/'+__file.replace(/^\//, '');
            remote_path = (__path+'/'+__file).replace(/\/\//g, '/');
            remote_dir = remote_path.split('/');
            remote_dir.pop();
            remote_dir = remote_dir.join('/');             
            if(!fs.existsSync(remote_dir)){
                console.log('Deploy create dir', remote_dir);
                fs.mkdirSync(remote_dir, {recursive: true});
            }  
            console.log('Deploy copy file', local_path, 'to', remote_path);            
            try {
                fs.copyFileSync(local_path, remote_path);
                deployed.push(__file);
            }catch(__err){
                console.log('Deploy copy file error', __err);
                failed.push(__file);
            }  
        });
        __cb(deployed, failed);
    }

    function ftpDeploy(__conn, __path, __files, __cb){  
        !__path.length ? __path = '/' : null;
        let conn = {};
        let arr = __conn.split('@');
        if(arr.length < 2){
            console.log('ftp connection info missing');
            return;
        }
        let up = arr[0].split(':');
        if(up.length < 2){
            console.log('ftp connection info missing');
            return;
        }
        let addr = arr[1].split(':');
        if(addr.length < 2){
            console.log('ftp connection info missing');
            return;
        } 

        conn.user = up[0];
        conn.password = up[1];
        conn.host = addr[0];
        conn.port = addr[1];
        conn.secure = false;      
       
        const ftp = require('basic-ftp');
        const client = new ftp.Client();
        client.ftp.useEPSV = true;
  
        client.access(conn).then(()=>{        
            const res = {deployed: [], failed: []};
            uploadFiles(client, __path, __files, (__res)=>{
                __cb(__res.deployed, __res.failed);
            }, res);   
        });  
    }   

    function uploadFiles(__client, __path, __files, __cb, __o){    
        if(__files.length){
            var file = __files.shift();

            //need path there
            uploadFile(__client, __path, file, 
                (__file) => {                                       
                    __o.deployed.push(__file);
                    if(__files.length){                       
                        uploadFiles(__client, __path, __files, ()=>{uploadFiles(__client, __path, __files, __cb, __o)}, __o);
                    }else{
                        __client.close();
                        __cb(__o);
                    }
                },
                (__file) => {
                    __o.failed.push(__file);
                    if(__files.length){                       
                        uploadFiles(__client, __path, __files, ()=>{uploadFiles(__client, __path, __files, __cb, __o)}, __o);
                    }else{
                        __client.close();
                        __cb(__o);
                    }
                }
            );
        }else{
            __client.close();
            __cb(__o);
        }
    }
   
    function uploadFile(__client, __path, __file, __success, __fail){   
        let file_name = __file.split('/').pop();
        let src =  'www/'+__file.replace(/^\/+/g, '');        
        let dest = (__path+'/'+__file).replace(/^\/+/g, '');
        let dir = '/'+dest.replace(file_name, '');       
        console.log('FTP upload ensureDir', dir);
        try{
            __client.ensureDir(dir).then(
                () => {           
                    console.log('FTP dir ensured', dir, 'upload', file_name);                     
                     //need the filename jere
                    __client.uploadFrom(src, '/'+dest).then(
                        () => {
                            console.log('FTP upload success', src, '/'+dest);
                            __success(src);
                        },
                        () => {
                            console.log('FTP upload fail', src, '/'+dest);
                            __fail(src);
                        }
                    );
                },
                (__err) => {
                    console.log('FTP ensureDir error', __err);
                    __fail(src);
                }  
            );
        }catch(__err){
            console.log('FTP upload error', __err);
            __fail(src);
        }
    }
}

