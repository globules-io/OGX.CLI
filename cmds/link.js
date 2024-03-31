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
    let index_file = args[args.length-1].index;
    if(args.length){
        const fs = require('fs');
        let index = fs.readFileSync('www/'+index_file, 'utf-8');
        if(index){
            if(['all', 'controllers'].includes(args[0])){   
                fs.readdirSync('www/js/controllers').forEach(file => {  
                    if(/\.js$/.test(file)){
                        if(!index.includes('js/controllers/'+file)){                
                            index = index.replace('</head>', '<script type="application/javascript" src="js/controllers/'+file+'"></script>\n</head>');  
                        }
                        console.log('Info: linked', file);
                    }
                });
            }  
            if(['all', 'views'].includes(args[0])){  
                fs.readdirSync('www/js/views').forEach(file => {   
                    if(/\.js$/.test(file)){   
                        if(!index.includes('js/views/'+file)){                            
                            index = index.replace('</head>', '<script type="application/javascript" src="js/views/'+file+'"></script>\n</head>');  
                        }
                        if(!index.includes('css/views/view.'+file.split('.')[1]+'.css')){     
                            index = index.replace('</head>', '<link rel="stylesheet" href="css/views/view.'+file.split('.')[1]+'.css" type="text/css">\n</head>'); 
                        }
                        console.log('Info: linked', file);
                    }
                });
            }             
            if(['all', 'stages'].includes(args[0])){    
                fs.readdirSync('www/js/stages').forEach(file => {   
                    if(/\.js$/.test(file)){
                        if(!index.includes('js/stages/'+file)){                              
                            index = index.replace('</head>', '<script type="application/javascript" src="js/stages/'+file+'"></script>\n</head>');  
                        }
                        if(!index.includes('stage.'+file.split('.')[1]+'.css')){            
                            index = index.replace('</head>', '<link rel="stylesheet" href="css/stages/stage.'+file.split('.')[1]+'.css" type="text/css">\n</head>'); 
                        }
                        console.log('Info: linked', file);
                    }
                });       
            } 
            if(['all', 'css'].includes(args[0])){                   
                fs.readdirSync('www/css/bin').forEach(file => {   
                    if(/\.css$/.test(file)){
                        if(!index.includes('css/bin/'+file)){                           
                            index = index.replace('</head>', '<link rel="stylesheet" href="css/bin/'+file+'" type="text/css">\n</head>');  
                        }
                        console.log('Info: linked', file);
                    }
                });       
            }
            if(['all', 'js'].includes(args[0])){                 
                fs.readdirSync('www/js/bin').forEach(file => {   
                    if(/\.js$/.test(file)){
                        if(!index.includes('js/bin/'+file)){                              
                            index = index.replace('</head>', '<script type="application/javascript" src="js/bin/'+file+'"></script>\n</head>');  
                        }
                        console.log('Info: linked', file);
                    }
                });       
            }   
            fs.writeFileSync('www/'+index_file, index);    
        }else{
            console.log('Warning:', index_file, 'file not found, linking skipped');
        } 
    }
};