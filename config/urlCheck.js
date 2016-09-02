module.exports = function (Url) {
    return new Promise(function(resolve, reject) {
        var http = require('http'), url = require('url');
        var options = {
            method: 'HEAD',
            host: url.parse(Url).host,
            port: 80,
            path: url.parse(Url).pathname
        };

        var req = http.request(options, function (r) {
            if(r.statusCode < 500) {
                resolve(r.statusCode);
            } else {
                reject(r.statusCode);
            }
        });

        req.on('error', function (err) {
            reject(false);
        });
        req.end();
    });
}