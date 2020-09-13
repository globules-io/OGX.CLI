#!/usr/bin/env node

module.exports = (args) => {
    const fs = require('fs');
    if(!fs.existsSync('www/css/stages')){
        fs.mkdirSync('www/css/stages', {recursive:true});            
    }
    if(!fs.existsSync('www/css/views')){
        fs.mkdirSync('www/css/views', {recursive:true});            
    }
    if(!fs.existsSync('www/css/lib')){
        fs.mkdirSync('www/css/lib', {recursive:true});            
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
};