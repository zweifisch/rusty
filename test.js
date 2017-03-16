let PImage = require('pureimage')
let fs = require('fs')
let rusty = require('./index')

let fonts = [
    ['Slabo', 25, 'Slabo.ttf']
]

rusty.registerFonts(fonts).then(() => {
    let {canvas, code} = rusty.captcha({
        fonts
    })
    console.log(code)
    rusty.save(canvas, fs.createWriteStream('rusty.png'))
})
