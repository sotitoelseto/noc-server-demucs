var ObjectID = require('mongodb').ObjectID;
async function save_image(db, files, instrument_id) {
  let result
  console.log(`saving files for id ${instrument_id}`)
  for(file of files.files) {
    console.log('value: ' + file.name)
    var newfile = JSON.parse(JSON.stringify(file));
    newfile.it_id = instrument_id
    result += await db.getConnection().collection("images").insertOne(newfile);
  }
  
  return({
    serverResponse : result
  })
}

async function find_by_instrumentId(db, instrument_id) {
  let promise = new Promise((resolve, reject) => {
    db.getConnection().collection('images').find({it_id : instrument_id}).toArray(function(err, result) {     
      resolve(result)
    })
  })
  return promise
}
async function find_by_id(db, image_id) {
  let promise = new Promise((resolve, reject) => {
    db.getConnection().collection('images').find({"_id": ObjectID(image_id)}).toArray(function(err, result) {     
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