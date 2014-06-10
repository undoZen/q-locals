q-locals
========

Usage
-----

```
var express = require('express');
var app = express();
require('q-locals')(app);
```

It will monkey-patch app object to overwrite `#render()` and `#json()` method to resolve promise properties of `res.locals` and the second parameter of `#render()` method. It will not recursively resolve deep properties which means `res.locals.someProp.promiseHere` will not be resolved automatically.

You can also patch on express:

```
require('q-locals')(express);
```

or create a object which is `Object.create`d of response and overwrite `#render()` and `#json()` methods:

```
app.response = require('q-locals').createResponse(app.response);
```
