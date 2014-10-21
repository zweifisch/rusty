# rusty

captcha for nodejs

```javascript
rusty = require("rusty");

// available options
app.use("/captcha.png", rusty.middlware({
    width: 120,
    height: 50,
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
