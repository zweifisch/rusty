# rusty

[![NPM Version][npm-image]][npm-url]

captcha for nodejs, in pure js

```javascript
var rusty = require("rusty")

app.use("/captcha.png", rusty.middlware())

app.post("/login", rusty.verifyCaptcha, function(req, res) {
    if(req.verifyCaptcha(req.body.captcha)) {
        // human here
    }
});
```

options

```javascript
app.use("/captcha.png", rusty.middlware({
    width: 120,
    height: 50,
    background: '#ffffff',
    color: '#888888',
    chars: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 4,
    fonts: [['name', 20, 'path/to/font.ttf']],
    session: 'captcha'
}))
```

[npm-image]: https://img.shields.io/npm/v/rusty.svg?style=flat
[npm-url]: https://npmjs.org/package/rusty
