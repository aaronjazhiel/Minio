
var Minio = require('minio')
var Fs = require('fs')

var minioClient = new Minio.Client({
    endPoint: '18.217.37.159',
    port: 9000,
    secure: false,
    accessKey: 'VOC0R36X2GWHPC8XMGX8',
    secretKey: '6mX/ZR09oLjaYm5uMnWrWu5+SqGuBwmHHhIvtPR5'
});



var objectsStream = minioClient.listObjects('documentos', '', true)
 objectsStream.on('data', function(obj) {
   console.log(obj)
 })
 objectsStream.on('error', function(e) {
   console.log(e)
 })



var file = 'C:/Users/adelgago/Desktop/modelo-onpremise-o-cloud.pdf'
 minioClient.fPutObject('documentos', 'modelo-onpremise-o-cloud.pdf', file, 'application/octet-stream', function(e) {
   if (e) {
   return console.log(e)
   }
   console.log("Success")
  })


 minioClient.removeObject('documentos', 'prueba.cvs', function(e) {
  if (e) {
    return console.log(e)
   }
  console.log("Success")
 })




 var size = 0
 minioClient.fGetObject('documentos', 'Mirth.docx', 'C:/Users/adelgago/Desktop/Minio/descargar.docx', function(e) {
  if (e) {
    return console.log(e)
  }
  console.log('done')
 })


 minioClient.statObject('documentos', 'Mirth.docx', function(e, stat) {
  if (e) {
    return console.log(e)
  }
  console.log(stat)
})


