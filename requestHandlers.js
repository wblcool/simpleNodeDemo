var exec = require("child_process").exec,
    querystring = require("querystring"),
    formidable = require("formidable"),
    fs = require("fs");


function start(response){

    var body = `<html>
                    <head>
                    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
                    </head> 
                    <body>
                        <form action="/upload" method="post" enctype="multipart/form-data">
                            <input type="file" name="upload" multiple="multiple"/>
                            <input type="submit" value="Upload file" />
                        </form>
                    </body>    
                </html>`;

    // exec("ls -lah", function(error, stdout, stderr){
    //     response.writeHead(200, {"content-Type": "text/plain"});
    //     response.write(stdout);
    //     response.end();
    // });
    response.writeHead(200, {"content-Type": "text/html"});
    response.write(body);
    response.end();
    console.log("Request handler 'start' was called.");
}

function upload(response, request){

    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");

    form.parse(request, function(error, fields, files){
        console.log("parsing done");
        console.log("\nfiles", files);
        console.log(files.upload.path);

        form.uploadDir='tmp';

        //fs.renameSync(files.upload.path, "./tmp/test.png");
        var readStream=fs.createReadStream(files.upload.path);
        var writeStream=fs.createWriteStream("./tmp/test.png");
        readStream.pipe(writeStream);
        readStream.on('end',function(){
             fs.unlinkSync(files.upload.path);
        });
       
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    })

   
}

function show(response){
    console.log("Request handler 'show' was called");
    fs.readFile("./tmp/test.png", "binary", function(error, file){
        if(error){
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        }else{
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;