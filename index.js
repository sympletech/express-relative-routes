const path = require('path');
const nodeGlobLoader = require('node-glob-loader');

module.exports = {
    init: ({
        app,
        basePath,
        middleware = (req, res, next) => next(),
        onError = (err, res) => {
            res.status(500);
            res.jsonp(err);
        }
    }) => {
        return nodeGlobLoader.load(`${basePath}/**/*routes*.js`, (exports, filename) => {
            const dirName = path.dirname(filename);
            const relativePath = path.relative(process.cwd(), dirName).replace(/\\/g, '/');
            exports({
                get: (apiPath, action, options) => app.get(`/${relativePath}${apiPath}`, middleware, (req, res, next) => handleApiAction({ action, req, res, next, options })),
                post: (apiPath, action, options) => app.post(`/${relativePath}${apiPath}`, middleware, (req, res, next) => handleApiAction({ action, req, res, next, options })),
                put: (apiPath, action, options) => app.put(`/${relativePath}${apiPath}`, middleware, (req, res, next) => handleApiAction({ action, req, res, next, options })),
                del: (apiPath, action, options) => app.delete(`/${relativePath}${apiPath}`, middleware, (req, res, next) => handleApiAction({ action, req, res, next, options }))
            });
        });

        async function handleApiAction({ action, req, res, next, options = {} }) {
            try {
                const payload = ((req.method === "POST" || req.method === "PUT") ? req.body : req.query) || {};

                const result = await action(payload, {
                    req,
                    res,
                    next,
                    options
                });

                if (!options.preventDefault) {
                    res.jsonp(result);
                }
            } catch (err) {
                onError(err, res);
            }
        }
    }
};

