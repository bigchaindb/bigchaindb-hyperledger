import * as driver from 'bigchaindb-driver';
import * as bip39 from 'bip39';

export const BDB_SERVER_URL = process.env.REACT_APP_BDB_SERVER_URL || 'http://localhost:9984';
export const BDB_API_PATH = `${BDB_SERVER_URL}/api/v1/`;

let conn;

export async function callChaincode(assetId, callback) {
    const rawResponse = await fetch(process.env.REACT_APP_CHAINCODE_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            assetId,
            callback
            })
    });

    const content = await rawResponse.json();

    console.log(content);
    return true
}

// gets a Ed25519Keypair from a pass phrase
export const getKeypairFromSeed = (seed) => {
    return new driver.Ed25519Keypair(bip39.mnemonicToSeed(seed).slice(0, 32));
};

// Creates a new asset in BigchainDB
export async function createNewAsset(keypair, asset, metadata) {
    await _getConnection();
    const condition = driver.Transaction.makeEd25519Condition(keypair.publicKey, true);

    const output = driver.Transaction.makeOutput(condition);
    output.public_keys = [keypair.publicKey];

    const transaction = driver.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [output],
        keypair.publicKey
    );

    const txSigned = driver.Transaction.signTransaction(transaction, keypair.privateKey);
    return await conn.postTransactionCommit(txSigned)
        .then(retrievedTx => {
            return retrievedTx
        })
        .catch(err => {
            return false
        });
}

// private: creates a connection to BDB server
export async function _getConnection() {
    if (!conn) {
        conn = new driver.Connection(BDB_API_PATH);
    }
}