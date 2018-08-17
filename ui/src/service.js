import io from 'socket.io-client';

export function wsListen(handleEvent) {
    
    let socket = io.connect('http://localhost:4000');

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

    const rawResponse = await fetch('http://localhost:5000/numbers', {
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
