# bigchaindb-hyperledger

### Integration of BigchainDB and Hyperledger.

*This project is the outcome of a remote Hackathon happening on the 16-17 of August 2018.*

### Design 

 [High Level Design specs](./specs/design.md)

### Implementation

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
#### data_job/

This is a node based cron job that posts transactions to BigchainDB network.

#### ui/

This is a react based app that access REST API of Hyperledger Fabric Chaincode.

#### hyperledger-chainservice

This is hyperledger chainservice that interacts with the fabric network and sends POST request to REST api exposed by `bdb-hyperledger-oracle/`

#### bdb-hyperledger-oracle/

This project is an express-websocket API that functions as an oracle between Hyperledger Fabric (here in `hyperledger-chainservice/`) and BigchainDB.

