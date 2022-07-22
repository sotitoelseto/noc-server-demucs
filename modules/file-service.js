const ObjectID = require('mongodb').ObjectID;
const sharp = require("sharp");
const toUint8Array = require('base64-to-uint8array')
const window = require('window')
const atob = require('atob')
function _base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

async function save_image(db, files, instrument_id) {
  let result
  console.log(`saving files for id ${instrument_id}`)
  const openned_connection = db.getConnection()
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
      const lastResult = await openned_connection.collection("images").insertOne(newfile);
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
  db.notify_close()
  return ({
    serverResponse: result
  })
}

async function find_by_instrumentId(db, instrument_id) {
  const ImagesCollection = db.getConnection().collection('images')
  const QUERY = { it_id: instrument_id }

  const cursor = await ImagesCollection.find(QUERY);

  /*var fs = require('fs')
  fs.appendFile('./logs/find_by_instrument_id.txt', JSON.stringify(cursor))*/

  return cursor
}
async function find_by_id(db, image_id) {
  const ImagesCollection = db.getConnection().collection('images')

  const QUERY = { "_id": ObjectID(image_id) }
  const IMAGE = await ImagesCollection.findOne(QUERY)
  //await db.notify_close()
  //console.log(IMAGE)
  return IMAGE
}
module.exports = {
  save_image,
  find_by_instrumentId,
  find_by_id
}