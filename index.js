const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const fs = require('fs')
const PORT = 3000

const cors = require('cors')

const corsOptions = {
  origin: "*",
}

const db_conn = require('./modules/database-connection.js')
const file_service = require('./modules/file-service.js')

app.use(fileUpload());
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  return res.send("Root URL")
})

app.post('/upload', async function(req, res) {
  console.log('files??')
  let result = await file_service.save_image(db_conn, req.files, req.body.instrument_id)
  console.log(result)
  res.send({'result':result})
});

app.get('/display',async function(req, res){
  console.log('looking for ' + req.params)
  const result = await file_service.find_by_id(db_conn, req.query.imageId)
  console.log(result[0])
    const b64 = Buffer.from(result[0].data).toString('base64');
    // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
    const mimeType = result[0].mimeType; // e.g., image/png
    
    res.send(`<img src="data:${mimeType};base64,${b64}" />`);
    //res.sendFile('./public/bandera.jpg', { root: __dirname });
})

app.get('/instrument-images',async function(req, res){
  const result = await file_service.find_by_instrumentId(db_conn, req.query.instrument_id)
  let resu = []
  for(r of result){
    resu.push({
      name : r.name,
      id : r._id,
      display: `https://RCK-FileServer.jmjdrwrk.repl.co/display?imageId=${r._id}`})
  }
    res.send(resu);
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})