import io from 'socket.io-client';


const WS_PATH = "localhost:3333"

export default function wsListen(handleEvent) {
    console.log(`subscribing to `, WS_PATH); // eslint-disable-line no-console

    let socket = io.connect('http://localhost');

    socket.on('connect', function (data) {
        console.log(`connected to `, WS_PATH)
    });

    socket.on('event', function (data) {
        console.log(data);

    });
    socket.on('disconnect', function () {
        console.log('disconnecting')
    });

}

export default async function callChaincode(asset, callback) {

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
