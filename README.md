# express-relative-api-routes

Addon for expressJS that makes adding routes as easy as adding files with the name *-routes.js in specified folders.

This plug-in will use your file structure to build out the route path

It smooths out the differences between GET and POST requests supplying all parameters to the handler as named params

It removes the need to send the response, converting whatever is returned from the handler function into JSON

Adds built in error handling at the route level so you do not need to add try/catch in your route handlers

## Initializing Express Relative Api Routes

    const express = require('express');
    const expressRelativeApiRoutes = require('express-relative-api-routes');

    const app = express();
    expressRelativeApiRoutes.init({
        app,
        basePath: './api',
        middleware: (req, res, next) => next(),     // Optional middleware to add to each route
        onError = (err, res) => {                   // Optional error handler will fire whenever any route throws an error
            res.status(500);                        // By default sends a 500 with the error
            res.jsonp(err);
        }
    });

## Adding a route definition 

In the basePath folder specified in the init function (or any sub folder) add a file that ends with -routes.js

for example create the following file /api/api-routes.js with the following example code

    module.exports = ({ get, post }) => {
        get('/', async () => {
            return 'This route will respond to requests made to /api and does not have any params'
        });

        get('/example', async ({ name, age }) => {
            return {
                message: 'This route will respond to requests made to /api/example?name=bob&age=24',
                name,
                age
            };
        });

        post('/post-example', async ({ name, age }) => {
            return {
                message: 'This route will respond to post requests made to /api/example with name and age in the form payload',
                name,
                age
            };
        });
    };

## Preventing default response and using response

    module.exports = ({ get, post }) => {
        get('/custom-action', async ({},{ req, res, next }) => {
            res.send('This is plain text');
        }, { preventDefault: true });
    };

