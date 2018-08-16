const schedule = require('node-schedule')
const bdb = require('./bdb')
const env = require('./env').default


const keypair = bdb.createKeypair(env.admin.passphrase)


let count = 0

// Execute ever x seconds: '*/5 * * * * *'
var j = schedule.scheduleJob('*/5 * * * * *', function () {

    console.log("Executing create asset", count)
    const date = Date.now()
    const asset = {
        "hyperledger": "example",
        "number": count
    }
    const transaction = bdb.createNewAsset(keypair, asset, date)
    console.log(transaction.id)
    count++

})