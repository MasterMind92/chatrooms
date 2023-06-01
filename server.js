// declaration des modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var cache = {};


// fonction erreur 404
function send404(response) {
    response.writeHead(404, { 'Content-type': 'text/plain' });
    response.write('Error 404 : resource not found.');
    response.end();
}

// fonction d'envoie de fichier
function sendFile(response, filepath, fileContents) {
    response.writeHead(200, { "content-type": mime.lookup(path.basename(filepath)) });
    response.end(fileContents);
}

//
function serveStatic(response, cache, absPath) {

    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                })
            } else {
                send404(response);
            }
        });
    }

}