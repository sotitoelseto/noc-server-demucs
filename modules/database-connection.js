const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://moai:moai@cluster0.prrbi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function getConnection() {
  return conn = client.db('RCK');
}

function status() {
  const conn = getConnection()
  return conn.options
}

//Compare properties between two documents to fill the updateQuery
function getChanges(oldDoc, newDoc) {
  const oldkeys = Object.keys(oldDoc)
  const newkeys = Object.keys(newDoc)
  
  const oldSize = oldkeys.length
  const newSize = newkeys.length

  console.log(`oldSize ${oldSize} newSize ${newSize}`)

  if(oldSize > newSize){
    console.error('WARNING!! diferent key sizes\n')
  }
  const updateDoc = {}
  for(let key of oldkeys){
    if(typeof oldDoc[key]!='undefined' && typeof newDoc[key]!='undefined'){
      if(oldDoc[key] != newDoc[key]){
        if(oldDoc[key] === 'true' || newDoc[key] === 'false' || oldDoc[key] === 'false' || newDoc[key] === 'true'){
          if(Boolean(oldDoc[key]) != Boolean(newDoc[key])){
            
            console.log(`${key} ${oldDoc[key]} ?? ${typeof key} ${newDoc[key]}`)
            console.log(`distinct!! ${oldDoc[key]}\n`)

            updateDoc.key = Boolean(newDoc[key])
          }
        }else{
          
          console.log(`${key} ${oldDoc[key]} ?? ${typeof key} ${newDoc[key]}`)
          console.log(`distinct!! ${oldDoc[key]}\n`)

          updateDoc[key] = newDoc[key]
        }
      }
    }
  }
  console.log(updateDoc)
  return updateDoc
}

module.exports = {
  getConnection,
  status,
  getChanges
};