const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
// Create the first peer
const ipfs1 = new IPFS({ 
	repo: './ipfs1' ,
	 "config":{
         "Addresses":{
            "Swarm":['/ip4/0.0.0.0/tcp/0',"/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"]}
        },
   "EXPERIMENTAL":{"pubsub":true}
})
ipfs1.on('ready', async () => {
  // Create the database
  const orbitdb1 = new OrbitDB(ipfs1, './orbitdb1')
  const db1 = await orbitdb1.log('events')

  // Create the second peer
  const ipfs2 = new IPFS({ 
     repo: './ipfs2log' ,
	 "config":{
         "Addresses":{
            "Swarm":['/ip4/0.0.0.0/tcp/0',"/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"]}
        },
   "EXPERIMENTAL":{"pubsub":true}
  })
  ipfs2.on('ready', async () => {
    // Open the first database for the second peer,
    // ie. replicate the database
    const orbitdb2 = new OrbitDB(ipfs2, './orbitdb2')
    const db2 = await orbitdb2.log(db1.address.toString())

    // When the second database replicated new heads, query the database
    db2.events.on('replicated', () => {
      const result = db2.iterator({ limit: -1 }).collect().map(e => e.payload.value)
      console.log(result.join('\n'))
    })

    // Start adding entries to the first database
    setInterval(async () => {
      await db1.add({ time: new Date().getTime() })
    }, 1000)
  })
})