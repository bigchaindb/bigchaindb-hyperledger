# BigchainDB - HyperLedger Fabric Integration Hackathon with TheLedger team

## Problem Statement

How to use BigchainDB data in HyperLedger chain code? What can be integration patterns to make this happen?

## Solution Approach

![arch diagram](./hld.png "hld diagram")

The solution approach is based on how Oraclize works for Ethereum. Following are the steps involved,

1. HLF chain code is called by an external party (dapp). This chain code has the built in functionality to call a REST API from one of its functions.
1. The chain code is called by the dapp with the parameters and BigchainDB query.
1. The chain code runs the logic in it and calls the REST API on the backend or oracle component. https://hyperledger.github.io/composer/latest/integrating/call-out
1. The backend oracle component is a REST API based service which sits between HLF and BDB.
1. The chain code call the oracle service with 2 parameters,
    1. the query to run on BDB
    1. the code to run after the query (as a callback)
1. The oracle service calls BDB API for the query
1. Once the data is returned by BDB, the oracle runs the rest of the logic in callback.

This why the HLF chain code does not have to depend and wait for the query to complete on BDB. The entire logic runs in a deterministic way.
