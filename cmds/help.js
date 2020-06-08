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
        description : list and add for preload all images in /www/img    

    sounds
        syntax      : ogx sounds
        description : list and add for preload all sounds in /www/snd

    jsons
        syntax      : ogx jsons
        description : list and add for preload all json documents from /www/json

    omls
        syntax      : ogx omls
        description : list and add for preload all oml documents from /www/oml

    oses
        syntax      : ogx oses
        description : list and add for preload all ose documents from /www/ose

    fonts
        syntax      : ogx fonts
        description : list and add for preload all fonts from /www/fonts and create and link font.css into index.html

    templates
        syntax      : ogx templates
        description : list and add for preload all html templates from /www/html

    link
        syntax      : ogx link [type]
        description : list all files of a type and links them to the index file
        example     : ogx link all

    unlink
        syntax      : ogx unlink [type]
        description : list all files of a type and unlinks them from the index file
        example     : ogx link all

    prepare
        syntax      : ogx prepare
        description : links all files and set the preload
        example     : ogx prepare

    build
        syntax      : ogx build [target] [optional mode]
        description : build the application
        example     : ogx build android

    deploy
        syntax      : ogx deploy [platform] [build]
        description : deploys build to device
        example     : ogx deploy android debug

    set
        syntax      : ogx set [property] [value]
        description : change a setting of the CLI, such as the example
        example     : ogx set index index.php

    unset
        syntax      : ogx unset [property] [value]
        description : remove a setting from the CLI, if not index
        example     : ogx unset property value

    dev
        syntax      : ogx dev
        description : link the dev/debug version of OGX.JS to index
        example     : ogx dev

    prod
        syntax      : ogx prod
        description : link the production version of OGX.JS to index
        example     : ogx prod

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
    type   : type of object (js, css, views, controllers or stages)`,

    unlink: `
    syntax : ogx unlink [type] 
    type   : type of object (js, css, views, controllers or stages)`
};

module.exports = (args) => {   
    const subCmd = args[0] === 'help'? args[1] : args[0];
    console.log(menus[subCmd] || menus.main);    
};