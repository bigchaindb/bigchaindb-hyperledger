<center>

![](https://image.ibb.co/gePQce/black_1x.png)
# Chainservice for interaction with the Fabric network
[![Build Status](https://travis-ci.org/wearetheledger/hyperledger-typescript-boilerplate.svg?branch=master)](https://travis-ci.org/wearetheledger/hyperledger-typescript-boilerplate) 
[![Greenkeeper badge](https://badges.greenkeeper.io/wearetheledger/hyperledger-typescript-boilerplate.svg)](https://greenkeeper.io/)

</center>

### This chainservice is based on the [Hyperledger Typescript Boilerplate ](https://medium.com/wearetheledger/hyperledger-fabric-typescript-boilerplate-455004d0c6c8)


### Install dependencies
`yarn`
### Starting the app
`yarn run start:watch`

### Endpoints

* POST /numbers `{ assetId, callback }`
e.g: 
```
{
“assetId” :“d574d200d0640837935c9e7b9893bce93789a3bd608a8b26a6050e16cf91f0ed”,
“callback” : “function (data) {if (data.number > 0) {return \“Number is greater than 0. Number is \” + data.number;} else if (data.number== 0) {return \“Number is 0.\“;} else {return \“Number is less than 0. Number is \” + data.number;}}”
}
```

* GET /numbers/:assetId to test if the POST succeeded

