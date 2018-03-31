
var Express = require("express");
var Multer = require("multer");
var Minio = require("minio");
var BodyParser = require("body-parser");
var app = Express();

app.use(BodyParser.json({limit: "4mb"}));

var minioClient = new Minio.Client({
    endPoint: '18.217.37.159',
    port: 9000,
    secure: false,
    accessKey: 'VOC0R36X2GWHPC8XMGX8',
    secretKey: '6mX/ZR09oLjaYm5uMnWrWu5+SqGuBwmHHhIvtPR5'
});

app.post("/upload", Multer({storage: Multer.memoryStorage()}).single("upload"), function(request, response) {
    minioClient.putObject("documentos", request.file.originalname, request.file.buffer, function(error, etag) {
        if(error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});

app.post("/uploadfile", Multer({dest: "./uploads/"}).single("upload"), function(request, response) {
    minioClient.fPutObject("documentos", request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
        if(error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});

app.get("/download", function(request, response) {

 console.log('imprime'+request.query.filename);
   minioClient.getObject("oficios", request.query.filename, function(error, stream) {
        if(error) {
            return response.status(500).send(error);
        }
        stream.pipe(response);
    });
});

minioClient.bucketExists("oficios", function(error) {
    if(error) {
        return console.log(error);
    }
    var server = app.listen(3000, function() {
        console.log("Listening on port %s...", server.address().port);
    });
});