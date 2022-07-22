const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://moai:moai@cluster0.prrbi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var CONNECTIONS = 0
var OPENNED = 0
var CLOSED = 0

function status() {
  console.log('***** STATUS *****')
  return JSON.stringify({
    active_connections: CONNECTIONS,
    openned_connections: OPENNED,
    closed_connections: CLOSED,
    time: Date.now(),
    time_stamp: new Date(Date.now())
  })
}
//to pass from miliseconds time to normal date use let date_ob = new Date(ts);

async function getConnection() {
  console.log('****  CONNECTION OPENNED *****')
  CONNECTIONS += 1
  OPENNED += 1
  //https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
  return client.db('RCK');
}

async function getClient() {
  return client
}

async function notify_close() {
  await client.close()
  CONNECTIONS -= 1
  CLOSED += 1
  console.log('****  CONNECTION CLOSED *****')
  console.log('\t active connections ' + CONNECTIONS)
}

//Compare properties between two documents to fill the updateQuery
function getChanges(oldDoc, newDoc) {
  const oldkeys = Object.keys(oldDoc)
  const newkeys = Object.keys(newDoc)

  const oldSize = oldkeys.length
  const newSize = newkeys.length

  console.log(`oldSize ${oldSize} newSize ${newSize}`)

  if (oldSize > newSize) {
    console.error('WARNING!! diferent key sizes\n')
  }
  const updateDoc = {}
  for (let key of oldkeys) {
    if (typeof oldDoc[key] != 'undefined' && typeof newDoc[key] != 'undefined') {
      if (oldDoc[key] != newDoc[key]) {
        if (oldDoc[key] === 'true' || newDoc[key] === 'false' || oldDoc[key] === 'false' || newDoc[key] === 'true') {
          if (Boolean(oldDoc[key]) != Boolean(newDoc[key])) {

            console.log(`${key} ${oldDoc[key]} ?? ${typeof key} ${newDoc[key]}`)
            console.log(`distinct!! ${oldDoc[key]}\n`)

            updateDoc.key = Boolean(newDoc[key])
          }
        } else {

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
  getClient,
  status,
  getChanges,
  notify_close,
  CONNECTIONS,
  client
};