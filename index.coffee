Canvas = require 'canvas'

pickRandom = (items)->
    items[Math.floor(Math.random() * items.length)]

luminance = (hex, lum)->
    hex.match(/.{1,2}/g).map (c)->
        c = parseInt(c, 16) * (1 + lum)
        c = if c < 0 then 0 else if c > 255 then 255 else c
        c = Math.round(c).toString 16
        "00#{c}".substr c.length
    .join ''

captcha = ({height, width, length, color, background, chars, fonts, noise})->
    chars = (chars or 'abcdefghijklmnopqrstuvwxyz0123456789').match /.{1}/g
    length ?= 4
    width ?= 125
    height ?= 50
    color ?= '#888888'
    _color = color.substr 1
    background ?= "#ffffff"
    fonts ?= ['20px sans', '20px arial', 'bold 20px arial', 'italic 20px sans']
    noise = (noise or 90) * 0.01 - 0.5

    canvas = new Canvas width, height
    ctx = canvas.getContext '2d'

    ctx.fillStyle = background
    ctx.fillRect 0, 0, width, height
    ctx.fillStyle = ctx.strokeStyle = color

    code = ''
    cellWidth = width / length
    for i in [0...length]
        char = pickRandom chars
        code += char
        ctx.font = pickRandom fonts
        ctx.setTransform Math.random() * 0.4 + 1, Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.6 + 1, cellWidth * i + cellWidth * 0.4, height * 0.6
        ctx.fillStyle = "##{luminance _color, Math.random() * 0.1}"
        ctx.fillText char, 0, 0

    ctx.globalCompositeOperation = 'lighter'
    ctx.setTransform 1, 0, 0, 1, 0, 0
    for x in [0...Math.ceil(width * 0.5)]
        for y in [0...Math.ceil(height * 0.5)]
            if Math.random() < noise
                ctx.fillStyle = "##{luminance _color, Math.random()}"
                ctx.fillRect x * 2, y * 2, 2, 2

    canvas: canvas
    code: code

exports.captcha = captcha

exports.middleware = (options)->
    (req, res)->
        {canvas, code} = captcha options
        req.session.captcha = code
        canvas.toBuffer (err, buffer)->
            res.end buffer

exports.verifyCaptcha = (req, res, next)->
    req.verifyCaptcha = (input)->
        _captcha = req.session.captcha
        delete req.session.captcha
        _captcha and _captcha is input
    next()
