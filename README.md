# BigchainDB-Hyperledger Fabric Integration

This project is the outcome of a mini-hackathon in which the BigchainDB and TheLedger teams participated on the 16-17 of August 2018.

## Design

 [High Level Design specs](./specs/design.md)

## Directory Structure

The directory structure of this project is as below :

```
.
├── LICENSE
├── README.md
├── bdb-hyperledger-oracle/
│  
├── data_job/
│   
├── hyperledger-chainservice/
│  
├── specs/
│   
└── ui/
        
```

### data_job/

This is a node based cron job that posts transactions to BigchainDB network. 

### ui/

This is a react based app to access REST API of Hyperledger Fabric chain-code service. This UI is for demo usage of the BigchainDB-HyperLedger Fabric oracle.
The web form in the UI, takes two inputs - a BigchainDB asset ID and a JavaScript function. These inputs are passed to a HyperLedger chain-code which internally passes them to the oracle. The oracle then queries BigchainDB with the asset ID and executes the callback with asset.data of the queried asset.
The oracle then sends back the results to this UI using a websocket.

### hyperledger-chainservice/

This is hyperledger chain-service that interacts with the fabric network and sends POST request to REST api exposed by `bdb-hyperledger-oracle/`

### bdb-hyperledger-oracle/

This project is an express-websocket API that functions as an oracle between Hyperledger Fabric (here in `hyperledger-chainservice/`) and BigchainDB.

In a real scenario, the chain-code can do pre-processing and create a dynamic callback before sending the request to the oracle.

## Installation & Usage


### Prerequisites

* BigchainDB network is up and running
* Hyperledger network is up and running

### Installation

* From new terminal, in `data_job/`, execute `npm install` and then `npm start`. This will post transactions to BigchianDB network. 

> **Note** - save transaction id of one of this transaction, so that we can use it later to perform conditional operations from UI.

* From new terminal, in `bdb-hyperledger-oracle/`, execute `npm install` and then `npm start`. This will start BigchainDB-Hyperledger Oracle Server and expose REST API.
* From new terminal, in `hyperledger-chainservice/`, execute `yarn` and `yarn run start:watch`. This will start Hyperledger-chaincode REST server to be consumed by UI.
* From new terminal, in `ui/`, execute `npm install` and then `npm start`. This will start react application on port 3000. 

### Usage

* In your browser, visit `http://localhost:3000`, you will see UI for this project.
* In input field `Value`, type `transaction id` which you saved when you posted transactions in BigchainDB from `data_job/`.
* In input filed `Code Callback`, provide a valid javascript function that takes one input parameter. 
* Click on Submit. Then this function will be executed at oracle server and data fetched from BigchainDB will be passed to this callback function and the returned result will be sent back to UI via websockets from the oracle.



