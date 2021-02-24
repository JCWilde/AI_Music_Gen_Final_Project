const http = require("http");
const fs = require("fs");

const host = 'localhost';
const port = '8000';


const requestListener = function(req, res) {
    console.log(req.url);
    if (req.url == "/") req.url = "/index.html";
    fs.readFile("." + req.url, "UTF-8", function(err, file) {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end(err);
        }
        res.writeHead(200, { "Content-Type": "text/" + (req.url).split(".")[1] });
        res.end(file);
    });
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log('server is running on http://' + host + ':' + port);
})