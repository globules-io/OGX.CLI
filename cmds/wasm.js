#!/usr/bin/env node
module.exports = async (args) => {  

     //ogx build release PASSWORD --wasm domain.com

     const fs = require('fs');
     const options = args[args.length -1];
     let key, domain;

     //no pwd/domain, fallback read from ogx_cli.json
     if(args.length === 1){
          if(!options){
              console.error('WASM missing password and domain');
              return; 
          } 
          if(!options.hasOwnProperty('domain')){
               console.error('WASM missing domain');
               return; 
          }         
          domain = options.domain;
     }else{
          key = args[0];
          options.domain = domain = args[2];
          fs.writeFileSync('ogx_cli.json', JSON.stringify(options));
     }   
     
     console.log('WASM', key, domain);
    
     //generate the web assembly     
     const wabtFactory = require('wabt'); 
     const wabt = await wabtFactory();
     const wat = `
          (module

          (memory (export "memory") 1)

          ;; Embedded domain
          (data (i32.const 0) "${domain}\\00")

          ;; Embedded key
          (data (i32.const 256) "${key}\\00")

          ;; validate(hostPtr)
          ;; returns:
          ;;   1 = match
          ;;   0 = mismatch
          (func (export "validate") (param $host i32) (result i32)

          (local $i i32)

          (loop $compare

               ;; compare domain[i] vs host[i]

               (if
               (i32.ne
                    (i32.load8_u (local.get $i))
                    (i32.load8_u
                    (i32.add
                    (local.get $host)
                    (local.get $i)
                    )
                    )
               )
               (then
                    (return (i32.const 0))
               )
               )

               ;; reached end of string?
               (if
               (i32.eq
                    (i32.load8_u (local.get $i))
                    (i32.const 0)
               )
               (then
                    (return (i32.const 1))
               )
               )

               (local.set $i
               (i32.add
                    (local.get $i)
                    (i32.const 1)
               )
               )

               br $compare
          )

          (i32.const 0)
          )

          ;; get_key(hostPtr)
          ;; returns pointer to key or 0
          (func (export "get_key") (param $host i32) (result i32)

          (if (result i32)

               (call $validate_internal
               (local.get $host)
               )

               (then
               (i32.const 256)
               )

               (else
               (i32.const 0)
               )
          )
          )

          (func $validate_internal (param $host i32) (result i32)

          (local $i i32)

          (loop $compare

               (if
               (i32.ne
                    (i32.load8_u (local.get $i))
                    (i32.load8_u
                    (i32.add
                    (local.get $host)
                    (local.get $i)
                    )
                    )
               )
               (then
                    (return (i32.const 0))
               )
               )

               (if
               (i32.eq
                    (i32.load8_u (local.get $i))
                    (i32.const 0)
               )
               (then
                    (return (i32.const 1))
               )
               )

               (local.set $i
               (i32.add
                    (local.get $i)
                    (i32.const 1)
               )
               )

               br $compare
          )

          (i32.const 0)
          )

          )
          `;


     const wasmModule = wabt.parseWat(
          'ogx.wat',
          wat
     );
     const { buffer } = wasmModule.toBinary({
          log: false,
          write_debug_names: false
     });
     fs.writeFileSync('www/wasm/ogx.wasm', Buffer.from(buffer));     

     console.log('Generated ogx.wasm');
};