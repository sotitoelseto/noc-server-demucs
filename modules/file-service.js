const ObjectID = require('mongodb').ObjectID;
const sharp = require("sharp");
const toUint8Array = require('base64-to-uint8array')
const window = require('window')
const atob = require('atob')

const database_connection = require('./database-connection.js')


async function save_image(files, instrument_id) {
  let result
  console.log(`saving files for id ${instrument_id}`)
  await database_connection.client.db('RCK').command({ ping: 1 });
  console.log("Connected successfully to server");
  
  const conn = database_connection.client.db('RCK')
  for (file of files.files) {
    console.log(`sharping ${file.name} about ${file.size}`)//console.log(file)

    const buffer = Buffer.from(file.data, 'binary');
    let newdata = await sharp(buffer)
      .resize({
        fit: sharp.fit.contain,
        width: 600
      })
      .jpeg({ progressive: true, force: false, quality: 10 })
      .png({ progressive: true, force: false, quality: 10 }).toFile('./public/temp.' + file.name.split('.')[1])
    var fs = require('fs')
    const image = fs.readFileSync(`./public/temp.${file.name.split('.')[1]}`)
    //fs.writeFileSync('./public/out.txt', JSON.stringify(image))

    var newfile = JSON.parse(JSON.stringify(file));
    newfile.it_id = instrument_id
    newfile.data.data = JSON.parse(JSON.stringify(image)).data
    console.log(`\tsharped to ${newfile.size}\n\t uploading...`)
    try {
      const lastResult = await conn.collection("images").insertOne(newfile);
      newfile.data.data = []
      await conn.collection("images-light").insertOne(newfile)
      console.log(`lastResult ${lastResult}`)
      result += lastResult
      /*const image_metadata = {
        it_id: instrument_id,
        _id: lastResult._id
      }
      result += await openned_connection.collection("images_metadata").insertOne()*/

    } catch (e) {
      console.log('ERROR UPLOADING... Closing connection ' + e)
      //result += await openned_connection.collection("images").insertOne(image);
    }
  }
  //await db.notify_close()
  return ({
    serverResponse: result
  })
}

async function find_by_instrumentId(instrument_id) {
  
  await database_connection.client.db('RCK').command({ ping: 1 });
  console.log("Connected successfully to server");
  
  const ImagesCollection = database_connection.client.db('RCK').collection('images-light')
  
  const QUERY = { it_id: instrument_id }
  const cursor = await ImagesCollection.find(QUERY).toArray();

  //db.notify_close()
  return cursor
}

//https://stackoverflow.com/questions/66865958/mongoerror-topology-is-closed-please-connect-client-close-and-client-connect
async function find_by_id(image_id) {
  await database_connection.client.db('RCK').command({ ping: 1 });
  console.log("Connected successfully to server");
  
  const ImagesCollection = database_connection.client.db('RCK').collection('images')
  
  const QUERY = { "_id": ObjectID(image_id) }
  const IMAGE = await ImagesCollection.findOne(QUERY)
  
  //database_connection.notify_close()
  
  console.log(`IMAGE?? ${IMAGE}`)
  return IMAGE
}
module.exports = {
  save_image,
  find_by_instrumentId,
  find_by_id
}