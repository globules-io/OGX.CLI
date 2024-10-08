#!/usr/bin/env node

const menus = {
    main:`  
    ogx [command] <options>

    commands :
    init
        syntax      : ogx init
        description : create directory structure
        example     : ogx init

    update
        syntax      : ogx update [--force]
        description : install the latest version of OGX.JS
        example     : ogx init

    version
        syntax      : ogx version
        description : show the installed and latest version of OGX.CLI and OGX.JS

    create
        syntax      : ogx create [type] [id] 
        description : create an object (view, controller, template, stage)
        example     : ogx create template myTemplate

    rename
        syntax      : ogx rename [type] [name] [new_name] 
        description : rename an object (view, controller, template, stage)
        example     : ogx rename template myTemplate newTemplate

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

    css
        syntax      : ogx css [name]
        description : cycles through a view template and prefills css selectors in the css file of a view
        example     : ogx css MyView

    prepare
        syntax      : ogx prepare [optional type or subcommand]
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

    log
        syntax      : ogx log
        description : logs to ogx-debug.txt on desktop
        example     : ogx log

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

    encrypt
        syntax      : ogx encrypt [key]
        description : encrypts app.json
        example     : ogx encrypt secretkey

    decrypt
        syntax      : ogx decrypt [key]
        description : decrypts app.json
        example     : ogx decrypt secretkey

    pack
        syntax      : ogx pack [type]
        description : packs multiple files into one
        example     : ogx pack templates

    unpack
        syntax      : ogx unpack [type]
        description : unpacks multiple files
        example     : ogx unpack templates

    purge
        syntax      : ogx unpack [type]
        description : unpacks multiple files
        example     : ogx unpack templates

    help
        syntax      : ogx purge [type]
        description : looks for unused files and deletes them
        example     : ogx purge images
    `,

    create: `   
    syntax   : ogx create [type] [id] [template]
    type     : type of object (view, controller, template or stage)
    id       : id of object
    template : optional template (view and stage only)`,

    delete: `
    syntax : ogx create [type] [id] ogx   
    type   : type of object (view, controller, template or stage)
    id     : id of object`,

    prepare: `
    syntax     : ogx prepare [type or subcommand] [flags]
    type       : type of object (jsons, omls, images, templates, fonts)
    subcommand : skip clear
    flags      : --save --reset
    example    : ogx prepare skip images --save
    example    : ogx prepare skip --reset
    example    : ogx prepare clear
    `,

    link: `
    syntax : ogx link [type] 
    type   : type of object (js, css, views, controllers or stages)`,

    unlink: `
    syntax : ogx unlink [type] 
    type   : type of object (js, css, views, controllers or stages)`,

    pack: `
    syntax : ogx pack [type] 
    type   : type of object (templates, jsons, omls or all)`,

    unpack: `
    syntax : ogx unpack [type] 
    type   : type of object (templates, jsons, omls or all)`,

    purge: `
    syntax : ogx purge [type] 
    type   : type of object (stages, views, templates, controller, images or all)`
};

module.exports = (args) => {   
    const subCmd = args[0] === 'help'? args[1] : args[0];
    console.log(menus[subCmd] || menus.main);    
};