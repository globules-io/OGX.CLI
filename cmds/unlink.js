#!/usr/bin/env node

module.exports = (args) => {
    if(!args || !args.length){
        console.log('Error: Missing arguments! Expected [type]');
        return;
    }
    if(!/(all|views|controllers|stages|css|js)/gi.test(args[0])){
        console.log('Error: Invalid object!');
        return;
    }    
    if(args.length){
        const fs = require('fs');
        let options = args[args.length-1];
        let index = fs.readFileSync('www/'+options.index, 'utf-8');
        if(index){
            if(['all', 'controllers'].includes(args[0])){               
                fs.readdirSync('www/js/controllers').forEach(file => {      
                    if(/\.js$/.test(file)){            
                        index = index.replace('<script type="application/javascript" src="js/controllers/'+file+'"></script>\n', '');  
                        console.log('Info: unlinked', file);
                    }
                });
            }   
            if(['all', 'views'].includes(args[0])){               
                fs.readdirSync('www/js/views').forEach(file => {    
                    if(/\.js$/.test(file)){              
                        index = index.replace('<script type="application/javascript" src="js/views/'+file+'"></script>\n', '');  
                        index = index.replace('<link rel="stylesheet" href="css/views/view.'+file.split('.')[1]+'.css">\n', ''); 
                        console.log('Info: unlinked', file);
                    }
                });
            }            
            if(['all', 'stages'].includes(args[0])){   
                fs.readdirSync('www/js/stages').forEach(file => {   
                    if(/\.js$/.test(file)){               
                        index = index.replace('<script type="application/javascript" src="js/stages/'+file+'"></script>\n', '');  
                        index = index.replace('<link rel="stylesheet" href="css/stages/stage.'+file.split('.')[1]+'.css">\n', ''); 
                        console.log('Info: unlinked', file);
                    }
                });       
            }   
            if(['all', 'css'].includes(args[0])){   
                index = clearBin(index, args[0]);
                console.log('Info: unlinked css/bin');                
            }  
            if(['all', 'js'].includes(args[0])){   
                index = clearBin(index, args[0]);
                console.log('Info: unlinked js/bin');                   
            }  
            fs.writeFileSync('www/'+options.index, index);    
        }else{
            console.log('Warning: index.html file not found, unlink skipped');
        } 
    }

    function clearBin(__index, __type){
        let reg;        
        switch(__type){
            case 'all':
            reg = /(<link rel="stylesheet" href="css|<script type="application\/javascript" src="js)\/bin\/[a-zA-Z0-9\.\/_\-"= ]+>(<\/script>)?(\r\n|\n|\r)?/gi;
            break;

            case 'css':
            reg = /<link rel="stylesheet" href="css\/bin\/[a-zA-Z0-9\.\/_\-"= ]+>(\r\n|\n|\r)?/gi;
            break;

            case 'js':
            reg = /<script type="application\/javascript" src="js\/bin\/[a-zA-Z0-9\.\/_\-"= ]+><\/script>(\r\n|\n|\r)?/gi;
            break;
        }
        __index = __index.replaceAll(reg, '');       
        return __index;
    }
};