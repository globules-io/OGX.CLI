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
                index = index.replace(/<script (.*)js\/controllers\/(.+)><\/script>(\r\n|\r|\n)*/gim, '');  
                console.log('Info: unlinked js/controllers');  
            }   
            if(['all', 'views'].includes(args[0])){  
                index = index.replace(/<script (.*)js\/views\/(.+)><\/script>(\r\n|\r|\n)*/gim, '');
                index = index.replace(/<link (.*)css\/views\/(.+)>(\r\n|\r|\n)*/gim, '');
                console.log('Info: unlinked js/views');       
                console.log('Info: unlinked css/views');  
            }            
            if(['all', 'stages'].includes(args[0])){   
                index = index.replace(/<script (.*)js\/stages\/(.+)><\/script>(\r\n|\r|\n)*/gim, '');
                index = index.replace(/<link (.*)css\/stages\/(.+)>(\r\n|\r|\n)*/gim, ''); 
                console.log('Info: unlinked js/stages');       
                console.log('Info: unlinked css/stages');  
            }   
            if(['all', 'css'].includes(args[0])){   
                index = index.replace(/<link (.*)css\/bin\/(.+)>(\r\n|\r|\n)*/gim, ''); 
                console.log('Info: unlinked css/bin');                
            }  
            if(['all', 'js'].includes(args[0])){   
                index = index.replace(/<script (.*)js\/bin\/(.+)><\/script>(\r\n|\r|\n)*/gim, '');
                console.log('Info: unlinked js/bin');                   
            }  
            fs.writeFileSync('www/'+options.index, index);    
        }else{
            console.log('Warning: index.html file not found, unlink skipped');
        } 
    }  
};