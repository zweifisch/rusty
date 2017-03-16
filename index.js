const PImage = require('pureimage')

const pickRandom = items =>
    items[Math.floor(Math.random() * items.length)]

const luminance = (hex, lum) =>
    hex.match(/.{1,2}/g).map(c => {
        c = parseInt(c, 16) * (1 + lum)
        c = c < 0 ? 0 : (c > 255 ? 255 : c)
        c = Math.round(c).toString(16)
        return `00${c}`.substr(c.length)
    }).join('')

const captcha = ({ height=50, width=125, length=4,
    color='#333333', background='#ffffff', chars='0123456789', noise=0.2, fonts} = {}) => {

    chars = chars.match(/.{1}/g)

    canvas = PImage.make(width, height)
    ctx = canvas.getContext('2d')
    ctx.USE_FONT_GLYPH_CACHING = true

    ctx.fillStyle = background
    ctx.fillRect(0, -1, width, height + 1) // -1 removes the top bar
    ctx.fillStyle = ctx.strokeStyle = color

    code = ''
    cellWidth = width / length
    _color = color.substr(1)
    for(let i=0; i < length; i++) {
        char = pickRandom(chars)
        code += char
        let [font, size] = pickRandom(fonts)
        ctx.setFont(font, size)
        ctx.transform.setMatrix([Math.random() * 0.4 + 1, Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.6 + 1, cellWidth * i + cellWidth * 0.4, height * 0.6])
        ctx.fillStyle = `#${luminance(_color, Math.random() * 0.1)}`
        ctx.fillText(char, 0, size / 3)
    }

    _background = background.substr(1)
    ctx.transform.setMatrix([1, 0, 0, 1, 0, 0])
    for(let x=0; x < Math.ceil(width * 0.5); x++) {
        for(let y=0; y < Math.ceil(height * 0.5); y++) {
            if (Math.random() < noise) {
                ctx.fillStyle = `#${luminance(_background, Math.random())}`
                ctx.fillRect(x * 2, y * 2, 1 * pickRandom([1,2]), 1 * pickRandom([1,2]))
            }
        }
    }

    return {canvas, code}
}

exports.captcha = captcha

const registerFonts = fonts =>
    Promise.all(fonts.map(([name, size, path]) =>
            new Promise((resolve, reject) =>
                PImage.registerFont(path, name).load(err => err ? reject(err) : resolve()))))

exports.registerFonts = registerFonts

const save = (canvas, stream) =>
    new Promise((resolve, reject) =>
            PImage.encodePNG(canvas, stream, err => err ? reject(err) : resolve))

exports.save = save

exports.middleware = options => {
    options.fonts = options.fonts || [['Slabo', 25, `${__dirname}/Slabo.ttf`]]
    let loaded = registerFonts(options.fonts)
    return (req, res) => {
        loaded.then(() => {
            let {canvas, code} = captcha(options)
            req.session.captcha = code
            save(canvas, res)
        })
    }
}

exports.verifyCaptcha = (req, res, next) => {
    req.verifyCaptcha = input => {
        _captcha = req.session.captcha
        delete req.session.captcha
        return _captcha && _captcha === input
    }
    next()
}
