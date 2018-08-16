const driver = require('bigchaindb-driver')
const bip39 = require('bip39')
const env = require('./env').default

let conn

export function createKeypair(passphrase = 'example') {
    return new driver.Ed25519Keypair(bip39.mnemonicToSeed(passphrase).slice(0, 32))
}

export async function createNewDivisibleAsset(keypair, asset, amount = '900719925474090') {
    _getConnection()
    const txCreateDivisible = driver.Transaction.makeCreateTransaction(
        asset, {
            metaDataMessage: 'new token minted'
        }, [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(keypair.publicKey), amount)],
        keypair.publicKey
    )
    const txSigned = driver.Transaction.signTransaction(txCreateDivisible, keypair.privateKey)
    let tx
    await conn.postTransactionCommit(txSigned)
        .then((res) => {
            tx = res
        })

    return tx
}

export async function searchTypeInstances(text, type) {
    _getConnection()
    const txList = []
    const assetList = await conn.searchAssets(text)
    for (const asset of assetList) {
        if (asset.data.type === type) {
            const tx = await conn.getTransaction(asset.id)
            txList.push(tx)
        }
    }

    return txList
}

export async function searchAssets(text, type) {
    _getConnection()
    const assetList = await conn.searchAssets(text)
    const txList = []
    for (const asset of assetList) {
        if (asset.data.type === type) {
            txList.push(asset.data)
        }
    }
    return txList
}

export async function searchMetadata(text, type) {
    _getConnection()
    const txList = []
    const metadataList = await conn.searchMetadata(text)
    for (const metadata of metadataList) {
        if (metadata.metadata.type === type) {
            txList.push(metadata.metadata.energyGenerated)
        }
    }

    return txList
}

export async function searchMetadataGeneric(text) {
    _getConnection()
    const metadataList = await conn.searchMetadata(text)
    return metadataList
}

export async function getTokenBalance(publicKey, tokenId) {
    _getConnection()
    const unspents = await getOutputs(publicKey, false)
    let cummulativeAmount = 0
    let ownsTokens = false
    if (unspents && unspents.length > 0) {
        for (const unspent of unspents) {
            const tx = await conn.getTransaction(unspent.transaction_id)
            let assetId
            if (tx.operation === 'CREATE') {
                assetId = tx.id
            }

            if (tx.operation === 'TRANSFER') {
                assetId = tx.asset.id
            }

            if (assetId === tokenId) {
                ownsTokens = true
                const txAmount = parseInt(tx.outputs[unspent.output_index].amount)
                cummulativeAmount += txAmount
            }
        }

        if (ownsTokens) {
            return {
                token: tokenId,
                amount: cummulativeAmount
            }
        } else {
            throw new Error('Token not found in user wallet')
        }
    }
}

// Creates a new asset in driver
export async function createNewAsset(keypair, asset, metadata = {
    metadata: "none"
}) {
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

export async function getOutputs(publicKey, spent) {
    _getConnection()
    return await conn.listOutputs(publicKey, spent)
}


// Create coins from admin user
export async function transferGreenCoins(fromKeyPair, outputs, amount) {
    const assetId = env.bdb.tokenId
    let transferTokensTxs = []
    for (let entry of outputs) {
        transferTokensTxs.push(await transferTokens(fromKeyPair, assetId, entry.amount.toString(), entry.publicKey))
    }
    return transferTokensTxs
}


// Transfer divisible asset
  // To transfer divisible asset we need to match outputs and amounts on those outputs to new transaction
  // https://docs.bigchaindb.com/projects/js-driver/en/latest/usage.html#asset-transfer
export  async function  transferTokens(fromKeyPair, assetId, amount, toPublicKey, meta = {meta: new Date()}) {


    const toPublicKeysAmounts = [{
        publicKey: toPublicKey,
        amount
    }]
    // initialize connection
    _getConnection()
    
    const metadata = {
        event: 'Dewa Transfer',
        date: new Date(),
        timestamp: Date.now()
    }
    // get all transactions (create and transfer) of asset
    // we are transfering in one call
    const transactions = await conn.listTransactions(assetId)
    // map transactions to object so we can find it easily
    const mappedTxIds = {}
    for (const tx of transactions) {
      mappedTxIds[tx.id] = tx
    }
    // get unspent outputs fromKeyPair that we can transfer
    // https://docs.bigchaindb.com/projects/js-driver/en/latest/usage.html#difference-unspent-and-spent-output
    const unspents = await conn.listOutputs(fromKeyPair.publicKey, false)
    // generate list of outputs that can be used
    const unspentOutputs = []
    // loop over all unspent outputs of publicKey
    for (const unspent of unspents) {
      // check if unspent output is part of asset we are transfering
      if(unspent.transaction_id in mappedTxIds){
        // push to list of outputs with all needed data
        unspentOutputs.push({
          transaction_id: unspent.transaction_id,
          output_index: unspent.output_index,
          amount: parseInt(mappedTxIds[unspent.transaction_id].outputs[unspent.output_index].amount),
          tx: mappedTxIds[unspent.transaction_id]
        })
      }
    }
    // sort list to have smaller amounts processed first to reduce
    // breaking of asset to smaller and smaller chunks
    unspentOutputs.sort(function (a, b) {
      return a.amount - b.amount;
    })

    // generate new outputs with total amount spent in those outputs
    var totalAmount = 0
    const receivers = []
    // loop over publicKeys that are receiving items
    for (const entry of toPublicKeysAmounts) {
        // create output with desired amount
        const output = driver.Transaction.makeOutput(
          driver.Transaction.makeEd25519Condition(entry.publicKey),
          entry.amount.toString()
        )
        receivers.push(output)
        // store how much we already spent
        totalAmount = totalAmount + parseInt(entry.amount)
    }
    // fullfill old outputs based on amount spent on new outputs
    var totalSpent = 0
    const fullfillers = []
    const signers = []

    // loop over outputs
    for (const output of unspentOutputs) {
      // construct inputs that fullfill old outputs
      fullfillers.push({
        tx: output.tx,
        output_index: output.output_index
      })
      signers.push(fromKeyPair.privateKey)
      // calculate how much we already spent
      totalSpent += output.amount
      // stop looping if we reached exact number of spents
      if(totalSpent === totalAmount){
        break;
      }
      // if the outputs have higher number of amount we spent
      // we need to transfer remaining amount back to original user
      if(totalSpent > totalAmount){
        const remaining = totalSpent - totalAmount
        const output = driver.Transaction.makeOutput(
          driver.Transaction.makeEd25519Condition(fromKeyPair.publicKey),
          remaining.toString()
        )
        receivers.push(output)
        break;
      }
    }
    // construct transaction with new outputs and inputs pointing to old outputs
    const txTransfer = driver.Transaction.makeTransferTransaction(
        fullfillers,
        receivers,
        metadata
    )

    // sign and hash transaction
    const txSigned = driver.Transaction.signTransaction(txTransfer, ...signers)
    // send transaction in commit mode, return it when commited to BDB
    return await conn.postTransactionCommit(txSigned)
        .then(retrievedTx => {
            console.log('Transaction commited', retrievedTx.id)
            return retrievedTx
        })
        .catch(err => {
            console.log('Error while transfering', err)
            return false
        });
}


// gets a transaction based on id
export async function getTransaction(txId) {
    try {
        await _getConnection()
        const tx = await conn.getTransaction(txId)
        return tx
    } catch (err) {
        console.log(err)
        return null
    }
}


export async function getLastMeasuring() {
    await _getConnection()
    let today = new Date();
    let date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
    let latestRecords = await searchAssets(' "' + date + '"')
    // If the day has passed
    if(! latestRecords.length >0 ){
        today.setDate(today.getDate() - 1);
        date = await (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
    }    
    
    return latestRecords[latestRecords.length - 1].assetObject
}



// private: creates a connection to BDB server
export function _getConnection() {
    if (!conn) {
        conn = new driver.Connection(env.bdb.url)
    }
}