import reconnectCore from 'reconnect-core';
import SimpleWebsocket from 'simple-websocket';
import * as driver from 'bigchaindb-driver'; // eslint-disable-line import/no-namespace


export const BDB_SERVER_URL = process.env.REACT_APP_BDB_SERVER_URL || 'http://localhost:49984';
export const BDB_API_PATH = `${BDB_SERVER_URL}/api/v1/`;
export const BDB_WS_URL = process.env.REACT_APP_BDB_WS_URL || 'http://localhost:49985';
export const BDB_WS_PATH = `${BDB_WS_URL}/api/v1/streams/valid_transactions`;
console.log('BDB_SERVER_URL', BDB_SERVER_URL); // eslint-disable-line no-console
console.log('BDB_WS_URL', BDB_WS_URL); // eslint-disable-line no-console

const conn = new driver.Connection(BDB_API_PATH);

export const keypair = (seed) => new driver.Ed25519Keypair(seed.slice(0, 32));

export const publish = (publicKey, privateKey, payload, metadata) => {
    // Create a transation
    const tx = driver.Transaction.makeCreateTransaction(
        payload,
        metadata,
        [
            driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(publicKey))
        ],
        publicKey
    );
    // sign/fulfill the transaction
    const txSigned = driver.Transaction.signTransaction(tx, privateKey);

    // send it off to BigchainDB
    return conn.postTransaction(txSigned)
        .then(() => txSigned);
};

export const getUnspents = (publicKey, spent = undefined, callback) => // eslint-disable-line no-unused-vars
    conn.listOutputs(publicKey, spent)
        .then(unspents => unspents.map(elem => elem.transaction_id));

export const getTransaction = (txId) =>
    new Promise((resolve, reject) => {
        const txLocal = localStorage.getItem(txId);
        if (txLocal) {
            resolve(JSON.parse(txLocal));
        } else {
            let txFetched;
            let blockFetched;
            conn.getTransaction(txId)
                .then(tx => {
                    txFetched = tx;
                    return conn.listBlocks(txId);
                })
                .then(block => {
                    blockFetched = block;
                    return conn.listVotes(block[0]);
                })
                .then(votes => {
                    txFetched = {
                        ...txFetched,
                        block: blockFetched,
                        votes
                    };
                    localStorage.setItem(txId, JSON.stringify(txFetched));
                    resolve(txFetched);
                })
                .catch(reason => reject(reason));
        }
    });

export const listTransactions = (assetId) =>
    conn.listTransactions(assetId)
        .then((txList) => {
            if (txList.length <= 1) {
                return txList;
            }
            const inputTransactions = [];
            txList.forEach((tx) =>
                tx.inputs.forEach(input => {
                    if (input.fulfills) {
                        inputTransactions.push(input.fulfills.transaction_id);
                    }
                })
            );
            const unspents = txList.filter((tx) => inputTransactions.indexOf(tx.id) === -1);
            if (unspents.length) {
                let tipTransaction = unspents[0];
                let tipTransactionId = tipTransaction.inputs[0].fulfills.transaction_id;
                const sortedTxList = [];
                while (true) { // eslint-disable-line no-constant-condition
                    sortedTxList.push(tipTransaction);
                    try {
                        tipTransactionId = tipTransaction.inputs[0].fulfills.transaction_id;
                    } catch (e) {
                        break;
                    }
                    if (!tipTransactionId) {
                        break;
                    }
                    tipTransaction = txList.filter((tx) => // eslint-disable-line no-loop-func
                        tx.id === tipTransactionId)[0];
                }
                return sortedTxList.reverse();
            } else {
                console.error('something went wrong while sorting transactions',
                    txList, inputTransactions);
            }
            return txList;
        });

export const searchAssets = (search) =>
    conn.searchAssets(search)
        .then(assetList => assetList.map(asset => asset.id));

export const transfer = (tx, fromPublicKey, fromPrivateKey, toPublicKey, metadata) => {
    const txTransfer = driver.Transaction.makeTransferTransaction(
        [{ tx, output_index: 0 }],
        [
            driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(toPublicKey)
            )
        ],
        metadata
    );

    const txTransferSigned = driver.Transaction.signTransaction(txTransfer, fromPrivateKey);
    // send it off to BigchainDB
    return conn.postTransaction(txTransferSigned)
        .then(() => txTransferSigned);
};

export function connect(handleEvent) {
    console.log(`subscribing to ${BDB_WS_PATH}`); // eslint-disable-line no-console

    const reconnect = reconnectCore(() => new SimpleWebsocket(BDB_WS_PATH));

    return new Promise((resolve, reject) => {
        this.connection = reconnect({ immediate: true }, (ws) => {
            ws.on('open', () => {
                console.log(`ws connected to ${BDB_WS_PATH}`); // eslint-disable-line no-console
            });
            ws.on('data', (msg) => {
                const ev = JSON.parse(msg);
                handleEvent(ev);
            });
            ws.on('close', () => {
                console.log(`ws disconnected from ${BDB_WS_PATH}`); // eslint-disable-line no-console
            });
        })
            .once('connect', () => resolve(null))
            .on('error', (err) => {
                console.warn(`ws error on ${BDB_WS_PATH}:  ${err}`); // eslint-disable-line no-console
                reject(err);
            })
            .connect();
    });
}

export const getAssetId = (tx) => // eslint-disable-line
    tx.operation === 'CREATE' ? tx.id : tx.asset.id;