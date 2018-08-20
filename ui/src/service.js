import io from 'socket.io-client';
import appInsights from 'applicationinsights';

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
    let client = appInsights.defaultClient;
    client.trackEvent({name: "UISubmit", properties: { assetId: assetId, callback: callback }});

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
    
    client.trackEvent({name: "UIResponse", properties: { assetId: assetId, response: content }});
    console.log(content);
    return true
}
