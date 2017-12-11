const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually. 
// Note that these options need to be passed to IPFS in 
// all examples in this document even if not specfied so.
const ipfsOptions = {
 
  "repo":"/tmp/ipfs_dweb20171029",
  "config":{
         "Addresses":{
            "Swarm":['/ip4/0.0.0.0/tcp/0',"/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"]}
        },
   "EXPERIMENTAL":{"pubsub":true}
}

// Create IPFS instance
const ipfs = new IPFS(ipfsOptions)

// ipfs.on('ready', () => {
//   // Create OrbitDB instance
//  const orbitdb = new OrbitDB(ipfs)
//  // Create / Open a database
//  const db = await orbitdb.log('hello')
//  await db.load()

//  console.log(db.address.toString())
// })

ipfs.on('error', (e) => console.error(e))
ipfs.on('ready', async () => {
  // Create a database
  const orbitdb = new OrbitDB(ipfs)
  const db = await orbitdb.log('database name')
  // Add an entry to the database
  const hash = await db.add('hello world')
  // Get last 5 entries
  const latest = db.iterator({ limit: 5 }).collect()
  console.log(JSON.stringify(latest, null, 2))
})
