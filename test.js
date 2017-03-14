let PImage = require('pureimage')
let fs = require('fs')
let rusty = require('./index')

let fonts = [
    ['Source Sans Pro', 25, 'node_modules/pureimage/tests/fonts/SourceSansPro-Regular.ttf']
]

rusty.registerFonts(fonts).then(() => {
    let {canvas, code} = rusty.captcha({
        fonts
    })
    console.log(code)
    rusty.save(canvas, fs.createWriteStream('rusty.png'))
})
