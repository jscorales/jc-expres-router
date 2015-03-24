# jc-expres-router

A very simple configuration based router middleware for express 4.x

## Installation

```bash
$ npm install jc-express-router
```

## How to use jc-express-router

- Define your routes configuration file (routes.json):
```Javascript
{
  "/users": {
    "get": {
      "action": "getUsers",
      "controller: "users"
    },
    "post": {
      "action": "createUser",
      "contoller": "users"
    }
  },
  "/users/:userId": {
    "get": {
      "action": "getUserById",
      "controller": "users"
    }
  }
}
```

- Add the jc-express-router to express
```Javascript
//load modules
var express = require('express');
var router = require('jc-express-router');

var app = express();

//register routes using jc-express-router
app.use(router.registerRoutes());

app.listen(3000);
console.log('Listening on port 3000...');

```

**Note:** By default jc-express-router will look for the routers.json file in the application's root directory and it will look for the controller js files in the controllers folder.
```
controllers
  |- users.js
  |- products.js
routes.json
app.js
package.json
```
If you choose to have a different location and name for the controllers folder and routes configuration file, you can pass an options parameter to the registerRoutes method:

router.registerRoutes([options])

Options
- `routesConfigSource` - Path to the routes configuration file.
- `controllersPath` - Path to the folder containing your controller js files.

Like so:
```
app.use(router.registerRoutes({
  routesConfigSource: './app_routes.json',
  controllersPath: './app_controllers'
}));
```

## License
[MIT](LICENSE)
