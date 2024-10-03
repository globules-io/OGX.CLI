#!/usr/bin/env node
module.exports = (args) => {
    if(!args || args.length < 1){
        console.log('Error: Missing arguments! Expected [name]');
        return;
    }
    const fs = require('fs');
    if(!fs.existsSync('www/html/template.'+args[0]+'.html') || !fs.existsSync('www/css/views/view.'+args[0]+'.css')){
        console.log('Error: '+args[0]+' not found');
        return;
    }
    let css = fs.readFileSync('www/css/views/view.'+args[0]+'.css');
    css += '\n\r';
    const html = fs.readFileSync('www/html/template.'+args[0]+'.html');    
    const cheerio = require('cheerio');
    const $ = cheerio.load('<div id="cheerio_root">'+html+'</div>'); 

    cycle($('#cheerio_root'), null);

    fs.writeFileSync('www/css/views/view.'+args[0]+'.css', css);

    console.log('CSS file view.'+args[0]+'.css updated');

    function cycle(__node, __selector){
        !__selector ? __selector = '' : __selector += ' > ';      
        let el, id, cls, sel;
        __node.children().each((__idx, __el) => {
            el = $(__el);
            id = el.attr('id');
            cls = el.attr('class');
            if(typeof(id) !== 'undefined' && css.indexOf('#'+id) === -1){
                sel = '#'+id;
                css += sel+'{\r\n}\r\n';
            }else if(typeof(cls) !== 'undefined' && css.indexOf(__selector+'.'+cls) === -1){
                sel = __selector+'.'+cls;
                css += sel+'{\r\n}\r\n';
            }
            if(el.children().length){
                cycle(el, sel);
            }
        });
    }
};