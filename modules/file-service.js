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
  for (file of files.files) {
    console.log(`sharping ${file.name} about ${file.size}`)//console.log(file)
    //const { buffer, originalname } = file;
    //const timestamp = new Date().toISOString();
    //const ref = `${timestamp}-${originalname}.webp`;
    //https://stackoverflow.com/questions/51291678/compress-image-using-sharp-in-node-js
    const buffer = Buffer.from(file.data, 'binary');
    let newdata = await sharp(buffer)
      .jpeg({ progressive: true, force: false, quality: 10 })
      .png({ progressive: true, force: false, quality: 10 }).toFile('./public/temp.' + file.name.split('.')[1])
    var fs = require('fs')
    const image = fs.readFileSync(`./public/temp.${file.name.split('.')[1]}`)
    fs.writeFileSync('./public/out.txt', JSON.stringify(image))
    /***var myAArray = _base64ToArrayBuffer(image)
      //console.log(buffer)
      //console.log(myAArray)
      /*****console.log(newdata.binary)****

    *****let buff = new Buffer.from(newdata, 'base64');****
    // var arr = toUint8Array(newdata)
    /*const bufferObject = Buffer.alloc(16);
    
    var arrayBuffer = new ArrayBuffer(bufferObject.length);
    var typedArray = new Uint8Array(arrayBuffer);
    for (var i = 0; i < bufferObject.length; ++i) {
      typedArray[i] = bufferObject[i];
      /
    ******
    var len = buff.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = buff.toString().charCodeAt(i);
      ****


    //return bytes.buffer;
    //console.log(`bytes.buffer ${JSON.stringify(bytes)}`)


    /*var bytes = Object.keys(newdata).length;
    var myArr = new Uint8Array(bytes)
    for (var i = 0; i < bytes; i++) {
      myArr[i] = newdata[i].toString().charCodeAt(0);
      /
    
 
    // console.log(`newimage: ${Object.keys(newdata).length}`)
    //console.log('value: ' + file.name)
    ******let data4 = JSON.parse(JSON.stringify(bytes))
    let newArr = []
    for (k of Object.keys(data4)) {
      //console.log(data4[k])
      newArr.push(data4[k])
      ****
    ***** let newArr = []
     for (let i = 0; i < file.data.length; i = i + 2) {
       newArr.push(file.data[i])
       //console.log(i)
       ****
    *** /
  /**** console.log(`ensure ${Array.isArray(newArr)} and is about ${newArr.length}`)****/
    var newfile = JSON.parse(JSON.stringify(file));
    /******newfile.size = newArr.length*****/
    newfile.it_id = instrument_id
    newfile.data.data = JSON.parse(JSON.stringify(image)).data
    console.log(`\tsharped to ${newfile.size}\n\t uploading...`)//console.log(newfile)
    const openned_connection = db.getConnection()
    try {
      result += await openned_connection.collection("images").insertOne(newfile);
      openned_connection.close()
    } catch (e) {
      openned_connection.close()
      console.log('ERROR UPLOADING... Closing connection')
      //result += await openned_connection.collection("images").insertOne(image);
    }

  }

  return ({
    serverResponse: result
  })
}

async function find_by_instrumentId(db, instrument_id) {
  let promise = new Promise((resolve, reject) => {
    db.getConnection().collection('images').find({ it_id: instrument_id }).toArray(function(err, result) {
      resolve(result)
    })
  })
  return promise
}
async function find_by_id(db, image_id) {
  let promise = new Promise((resolve, reject) => {
    db.getConnection().collection('images').find({ "_id": ObjectID(image_id) }).toArray(function(err, result) {
      resolve(result)
    })
  })
  return promise
}
module.exports = {
  save_image,
  find_by_instrumentId,
  find_by_id
}