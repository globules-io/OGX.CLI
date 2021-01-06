#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs-extra');
    const path = require('path');
    if(!fs.existsSync('www/css/stages')){
        fs.mkdirSync('www/css/stages', {recursive:true});            
    }
    if(!fs.existsSync('www/css/views')){
        fs.mkdirSync('www/css/views', {recursive:true});            
    }
    if(!fs.existsSync('www/css/lib')){
        fs.mkdirSync('www/css/lib', {recursive:true});            
    }
    if(!fs.existsSync('www/css/bin')){
        fs.mkdirSync('www/css/bin', {recursive:true});            
    }
    if(!fs.existsSync('www/js/bin')){
        fs.mkdirSync('www/js/bin', {recursive:true});            
    }
    if(!fs.existsSync('www/js/controllers')){
        fs.mkdirSync('www/js/controllers', {recursive:true});            
    }
    if(!fs.existsSync('www/js/views')){
        fs.mkdirSync('www/js/views', {recursive:true});            
    }
    if(!fs.existsSync('www/js/stages')){
        fs.mkdirSync('www/js/stages', {recursive:true});            
    }
    if(!fs.existsSync('www/js/lib')){
        fs.mkdirSync('www/js/lib', {recursive:true});            
    }
    const src_lib = path.normalize(__dirname+'./../../js/lib');
    const dest_lib = path.normalize(__dirname+'./../../js/lib');
    fs.readdir(src_lib, (err, files) => {
        files.forEach(file => {
            if(!fs.existsSync(dest_lib+'/'+file)){
                fs.copySync(src_lib+'/'+file, dest_lib+'/'+file);
            }else{
                console.log(dest_lib+'/'+file+' already exists, skipping');
            }
        });
    });
};