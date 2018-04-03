
var Express = require("express");
var Multer = require("multer");
var cors = require('cors')
var Minio = require("minio");
var BodyParser = require("body-parser");
var app = Express();
app.use(cors());

app.use(BodyParser.json({limit: "4mb"}));

//Esta instancia es para generar la conexión en  la nube para Minio
var minioClient = new Minio.Client({
    endPoint: '18.217.37.159',
    port: 9000,
    secure: false,
    accessKey: 'VOC0R36X2GWHPC8XMGX8',
    secretKey: '6mX/ZR09oLjaYm5uMnWrWu5+SqGuBwmHHhIvtPR5'
});



//Esta funcion es para cargar el archivo ponerle en el key upload y muestra los enteros
app.post("/upload", Multer({storage: Multer.memoryStorage()}).single("upload"), function(request, response) {
    minioClient.putObject("documentos", request.file.originalname, request.file.buffer, function(error, etag) {
        if(error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});

//Esta funcion sirve para cargar un archivo pero los datos del File size, nombre
app.post("/uploadfile", Multer({dest: "./uploads/"}).single("upload"), function(request, response) {
    minioClient.fPutObject("documentos", request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
        if(error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});

//Descarga el documento pero es necesario colocarlo filename con el nombre
// http://localhost:3000/download?filename=DesdeServicioREST.JPG
app.get("/download", function(request, response) {
 console.log('imprime'+request.query.filename);
   minioClient.getObject("documentos", request.query.filename, function(error, stream) {
        if(error) {
            return response.status(500).send(error);
        }
        stream.pipe(response);
    });
});

// valida si existe el documento 
minioClient.bucketExists("oficios", function(error) {
    if(error) {
        return console.log(error);
    }
    var server = app.listen(3000, function() {
        console.log("Listening on port %s...", server.address().port);
    });
});