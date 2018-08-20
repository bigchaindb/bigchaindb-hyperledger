import io from 'socket.io-client';

export function wsListen(handleEvent) {
    console.log('ws path', process.env.REACT_APP_CHAINCODE_URL)
    
    let socket = io.connect(process.env.REACT_APP_WS);

    socket.on('connect', function(data){
        console.log(`Server : Greetings from BDB-Hyperledger-Oracle...`)
    });
    
    socket.on('data', function (data) {
        console.log(`Server : ${data}`);
    });
    socket.on('disconnect', function () {
        console.log('disconnecting')
    });

}

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
