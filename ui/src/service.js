import appInsights from 'applicationinsights';

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
