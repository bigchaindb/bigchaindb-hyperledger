<center>

![](https://image.ibb.co/gePQce/black_1x.png)

# Chainservice for interaction with the Fabric network

</center>

### This chainservice is based on the [ Hyperledger Typescript Boilerplate ](https://medium.com/wearetheledger/hyperledger-fabric-typescript-boilerplate-455004d0c6c8)

### Install dependencies

`yarn`

### Starting the app

`yarn run start:watch`

### Endpoints

POST /oracle `{ assetId }`

e.g:

```json
{
"assetId" :"d574d200d0640837935c9e7b9893bce93789a3bd608a8b26a6050e16cf91f0ed"
}
```

A callback has been stored in the chaincode itself with key 'CALLBACK1', e.g.

```code
"callback" : "function (data) {if (data.number > 0) {return \"Number is greater than 0. Number is \" + data.number;} else if (data.number== 0) {return \"Number is 0.\";} else {return \"Number is less than 0. Number is \" + data.number;}}"
```

* GET /oracle/:assetId to test if the POST succeeded

* POST /oracle/response to post the response to blockchain from oracle

Accepts:

```json
{
    "data": {
        "assetData": {
        },
    "status": "processed",
    "id": "2933b48f25ae37d2d45e8e7ba3e1f30bb5f85790e4095a65d9fe18ffe8d1a8dc"
    }
}
```