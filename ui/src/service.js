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
