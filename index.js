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
  return res.send(db_conn.status())
  console.log('<h1> RCK-FILE-SERVER-END-POINT </h1>')
})

app.post('/upload', async function(req, res) {
  console.log('files??')
  let result = await file_service.save_image(db_conn, req.files, req.body.instrument_id)
  console.log(result)
  res.send({ 'result': result })
});

app.get('/display', async function(req, res) {
  console.log('looking for ' + req.params)
  const result = await file_service.find_by_id(db_conn, req.query.imageId)
  //console.log(`RESULT: ${JSON.stringify(result[0].name)}`)
  //console.log(`displaying ${result[0].name}`)//console.log(result[0])
  const b64 = Buffer.from(result.data).toString('base64');
  // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER
  const mimeType = result.mimeType; // e.g., image/png

  var img = Buffer.from(result.data, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
  res.end(img);

  //res.send(`<img src="data:${mimeType};base64,${b64}" />`);
  //res.sendFile('./public/bandera.jpg', { root: __dirname });
})

app.get('/instrument-images', async function(req, res) {
  console.log('[QUERY] all images for given instrument id')

    const result = await file_service.find_by_instrumentId(db_conn, req.query.instrument_id)

    if(result == 'undefined'){console.log('POSIBLE ERROR INCOMING')}
    
    let resu = []
  
    for (r of result) {
      resu.push({
        name: r.name,
        id: r._id,
        display: `https://RCK-FileServer.jmjdrwrk.repl.co/display?imageId=${r._id}`
      })
    }
    res.send(resu);
  /*
    console.log(`[ERROR] retrieving all images for instrument ${req.query.instrument_id}`)
    fs.appendFile('./logs/errors.txt','\n'+JSON.stringify({
    operation : 'instrument-images()',
    status : JSON.parse(db_conn.status()),
    ERROR : e
  }))*/
})

app.get('/self/status', function(req, res) {
  return db_conn.status()
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})