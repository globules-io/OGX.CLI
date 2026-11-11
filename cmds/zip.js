#!/usr/bin/env node

module.exports = (args) => {
     console.log('Info: zipping update!');       
     const fs = require('fs');
     const JSZip = require('jszip');
     const zip = new JSZip();    
     let has_version = false;
     if(fs.existsSync('package.json')){
          const package = JSON.parse(fs.readFileSync('package.json'));
          if(package.hasOwnProperty('version')){
               has_version = true;
               const vers = {};
               vers.version = package.version;
               zip.file('version.json', JSON.stringify(vers));   
          }
     }
     if(!has_version){
          console.log('Warning: no package or version in package found');
     }
     zip.file('app.json', fs.readFileSync('www/app.json'));      
     zip.file('json.pak', fs.readFileSync('www/json/json.pak'));   
     zip.file('oml.pak', fs.readFileSync('www/oml/oml.pak'));  
     zip.file('html.pak', fs.readFileSync('www/html/html.pak'));   
     if(args.includes('--js')){
          zip.file('min.ejs', fs.readFileSync('www/js/min/min.ejs'));  
     }else{
          zip.file('min.js', fs.readFileSync('www/js/min/min.js'));  
     }
     zip.file('min.css', fs.readFileSync('www/css/min/min.css'));   
     
     zip.generateAsync({type:'nodebuffer'})
     .then((content)=>{
          fs.writeFileSync('update.zip', content);
     });  
}