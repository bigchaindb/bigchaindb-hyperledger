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

### hyperledger-chainservice

This is hyperledger chain-service that interacts with the fabric network and sends POST request to REST api exposed by `bdb-hyperledger-oracle/`

### bdb-hyperledger-oracle/

This project is an express-websocket API that functions as an oracle between Hyperledger Fabric (here in `hyperledger-chainservice/`) and BigchainDB.

In a real scenario, the chain-code can do pre-processing and create a dynamic callback before sending the request to the oracle.