import io from 'socket.io-client';


const WS_PATH = "localhost:3333"

export function connect(handleEvent) {
    console.log(`subscribing to `, WS_PATH); // eslint-disable-line no-console

    let socket = io.connect('http://localhost');

    socket.on('connect', function(data){
        console.log(`connected to `, WS_PATH)
    });
    
    socket.on('event', function (data) {
        console.log(data);

    });
    socket.on('disconnect', function(){
        console.log('disconnecting')
    });

}

export function callChaincode() {

    const asset = "asdfasdf"
    const callback = "example"
    const response = await axios.post('/chaincode', { asset, callback });
    console.log(response);
}


export const getAssetId = (tx) => // eslint-disable-line
    tx.operation === 'CREATE' ? tx.id : tx.asset.id;