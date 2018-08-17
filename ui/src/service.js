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

export async function callChaincode(asset, callback) {

    const rawResponse = await fetch('https://chaincode.org/post', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: {
            asset,
            callback
        }
    });
    const content = await rawResponse.json();

    console.log(content);
}
