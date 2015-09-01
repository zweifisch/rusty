# rusty

[![NPM Version][npm-image]][npm-url]

captcha for nodejs

```javascript
rusty = require("rusty");

// available options, all optional
app.use("/captcha.png", rusty.middlware({
    width: 120,
    height: 50,
    color: '#888888',
    background: '#ffffff',
    chars: 'abcdefghijklmnopqrstuvwxyz0123456789',
    length: 4,
    fonts: ['20px sans', '20px bold sans'],
    session: 'captcha'
}));

app.post("/login", rusty.verifyCaptcha, function(req, res) {
    if(req.verifyCaptcha(req.body.captcha)) {
        // human here
    }
});
```

[npm-image]: https://img.shields.io/npm/v/rusty.svg?style=flat
[npm-url]: https://npmjs.org/package/rusty
