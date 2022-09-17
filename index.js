const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const PORT = 3000
const multer = require("multer");
const cors = require('cors')
const { request } = require('https')
//npm install node - rdkafka
const corsOptions = {
  origin: "*",
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(cors(corsOptions))
app.use(express.static('web/'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');//hace que los metodos = functions que sean post, get .... no tengan problemas de seguridad y     puedan devolver y recibir los datos esperados
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.set('Access-Control-Expose-Headers', '*')
  next();
});
app.get('/producer', async (req, res) => {
  await awaitData(res, 10000)
  //res.send('data')
});

app.get('/', (req, res) => {
  const data = fs.readFileSync('web/index.html', 'utf8')
  res.send(data)
});
app.get('/waitRoom', (req, res) => {
  const data = '<p>Your song is going to be processed</p>'
  res.send(data)
});
app.get('/src/:fileName', (req, res) => {
  const fileName = req.params['fileName']
  res.download(`uploads/${fileName}`)
})
app.get('/dev', (req, res) => {
  const data = STACK
  res.send(data)
});
app.get('/stack', (req, res) => {
  const data = [STACK.shift()]
  res.send(data)
});
app.get('/demuxer/cores', (req, res) => {
  const data = fs.readFileSync('web/servers.html', 'utf8')
  res.send(data)
});
const PUBLISHED = []

app.post('/publish', async (req, res) => {
  console.log('waiting')
  const jbody = req.data
  console.log(JSON.stringify(req.body))
  // if (jbody.success) {
  //   PUBLISHED.push()
  // }
  res.send('fix response to dynamic res')
})

const ALLOWED = ['ferjo']
const STACK = []


app.post('/upload', async (req, res) => {
  //console.log(JSON.stringify(req.body))
  if (true) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {

        console.log(Object.keys(req.files.file))


        fs.writeFile('uploads/' + req.files.file.name, req.files.file.data, err => {
          if (err) {
            console.error(err);
          }
          // file written successfully
        });

        //REg to the task list
        STACK.push({ 'name': req.files.file.name, 'size': req.files.file.size, 'mimetype': req.files.file.mimetype })

        //Notify clients there is new task
        require('request').get("https://pbsc.jmjdrwrk.repl.co/notify/newtask")

        res.writeHead(302, {
          'Location': 'https://DemucsMaster.jmjdrwrk.repl.co/waitRoom'
        });
        res.end();

        //send response
        // res.send({
        //   status: true,
        //   message: 'File is uploaded'
        // });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
