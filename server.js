var http = require("http");
var url = require("url");

function start(route, handle){

    http.createServer(onRequest).listen(8888);
    console.log("Server has started");

    function onRequest(request, response){

        var 
            postData = "",
            pathname = url.parse(request.url).pathname;

        console.log("Request for " + pathname + "received");

        request.setEncoding("utf8");//设置接受数据编码格式UTF-8

        request.addListener("data", function(postDataChunk){
            postData += postDataChunk;
            console.log("Received Post data chunk '" + postDataChunk + "'."); 
        });
        
        request.addListener("end", function(){
            console.log("end called");
            route(handle, pathname, response, postData);
        });

    }
    
}
exports.start = start;

