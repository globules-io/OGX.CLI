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

    compress
        syntax      : ogx compress
        description : compress and link js and css files

    restore
        syntax      : ogx restore
        description : restore and link previously compressed fimes

    images
        syntax      : ogx images
        description : list and adds for preload all images in /www/img

    sounds
        syntax      : ogx sounds
        description : list and adds for preload all sounds in /www/snd

    jsons
        syntax      : ogx jsons
        description : list and adds for preload all json documents from /www/json

    templates
        syntax      : ogx templates
        description : list and adds for preload all html templates from /www/html

    link
        syntax      : ogx link [type]
        description : list all files of a type and links them to the index file
        example     : ogx link all

    unlink
        syntax      : ogx link [type]
        description : list all files of a type and unlinks them from the index file
        example     : ogx link all

    build
        syntax      : ogx build [target] [optional mode]
        description : build the application
        example     : ogx build android

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
    id     : id of object`,

    link: `
    syntax : ogx link [type] 
    type   : type of object (view, controller or stage)`,

    unlink: `
    syntax : ogx unlink [type] 
    type   : type of object (view, controller or stage)`
};

module.exports = (args) => {   
    const subCmd = args[0] === 'help'? args[1] : args[0];
    console.log(menus[subCmd] || menus.main);    
};