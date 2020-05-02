#!/usr/bin/env node

const menus = {
    main:`  
    ogx [command] <options>

    commands :
    create
        syntax      : ogx create [type] [id] 
        description : create an object (view, controller, template, stage)
        example     : ogx create template myTemplate

    delete
        syntax      : ogx delete [type] [id] 
        description : delete an object (view, controller, template, stage)
        example     : ogx delete template myTemplate

    version
        syntax      : ogx version
        description : show the current version of the CLI

    help
        syntax      : ogx help [optional_command]
        description : show the help menu
        example     : ogx help create
    `,

    create: `   
    syntax : ogx create [type] [id] 
    type   : type of object (view, controller, template or stage)
    id     : id of object`,

    delete: `
    syntax : ogx create [type] [id] ogx   
    type   : type of object (view, controller, template or stage)
    id     : id of object`
};

module.exports = (args) => {   
    const subCmd = args[0] === 'help'? args[1] : args[0];
    console.log(menus[subCmd] || menus.main);    
};