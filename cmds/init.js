#!/usr/bin/env node

module.exports = (args) => {    
    const fs = require('fs-extra');   
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
    if(!fs.existsSync('www/oml')){
        fs.mkdirSync('www/oml', {recursive:true});            
    }
    if(!fs.existsSync('www/json')){
        fs.mkdirSync('www/json', {recursive:true});            
    }
    if(!fs.existsSync('www/img')){
        fs.mkdirSync('www/img', {recursive:true});            
    }
    if(!fs.existsSync('www/fonts')){
        fs.mkdirSync('www/fonts', {recursive:true});            
    }
    if(!fs.existsSync('www/html')){
        fs.mkdirSync('www/html', {recursive:true});            
    }    
    if(!fs.existsSync('www/app.json')){
        let app = require('path').resolve(__dirname, '../files/app.ogx');
        let file = fs.readFileSync(app, 'utf-8');
        fs.writeFileSync('www/app.json', file);  
    }
};