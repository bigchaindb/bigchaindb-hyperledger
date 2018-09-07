const driver = require('bigchaindb-driver')
const bip39 = require('bip39')
const env = require('./env').default

let conn

export function createKeypair(passphrase = 'example') {
    return new driver.Ed25519Keypair(bip39.mnemonicToSeed(passphrase).slice(0, 32))
}

// Creates a new asset in driver
export async function createNewAsset(keypair, asset, metadata = {}) {
    _getConnection()
    const condition = driver.Transaction.makeEd25519Condition(keypair.publicKey, true)

    const output = driver.Transaction.makeOutput(condition)
    output.public_keys = [keypair.publicKey]

    const transaction = driver.Transaction.makeCreateTransaction(
        asset,
        metadata, [output],
        keypair.publicKey
    )

    const txSigned = driver.Transaction.signTransaction(transaction, keypair.privateKey)
    let tx
    await conn.postTransactionCommit(txSigned)
        .then(retrievedTx => {
            tx = retrievedTx
            console.log('Asset Created: ' + retrievedTx.id);
        })

    return tx
}

// private: creates a connection to BDB server
export function _getConnection() {
    if (!conn) {
        conn = new driver.Connection(env.bdb.url)
    }
}