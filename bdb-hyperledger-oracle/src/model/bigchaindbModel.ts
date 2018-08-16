/**
 * this module is a model containing functions to find transactions in bigchaindb network
 * It uses 'bigchaindb-driver'(https://github.com/bigchaindb/js-bigchaindb-driver) to find asset
 * transactions into bigchaindb nodes
 */
const { Connection } = require('bigchaindb-driver');

export default class BigchainDBModel {
    url : String;
    appKey: String;
    appId: String;

    constructor(bdb_node_url, app_key, app_id){
        this.url = bdb_node_url;
        this.appKey =  app_key;
        this.appId = app_id;
    }
   
    /**
     * finds asset from BigchainDB node and returns 
     * object containing asset data and metadata
     * @param {*} assetId id of the asset
     * @returns data - obj with asset data and metadata
     */
    async getAssetData(assetId){

        // Send the transaction off to BigchainDB
        const conn = new Connection(this.url,{
            app_id: this.appId,
            app_key: this.appKey
        });

        //find asset from BigchainDB node
       let tx = await conn.getTransaction(assetId);

       //check if asset exists with given id
       if(!tx){
           throw new Error(`No Assets found with id ${assetId}`);
       }

       //combine assset data and metadata into one data object
       let data = Object.assign(tx.asset.data, tx.metadata);

       return data;  
    }
}


