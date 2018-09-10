import { Chaincode, Helpers, NotFoundError, StubHelper } from '@theledger/fabric-chaincode-utils';
import * as Yup from 'yup';
import axios from 'axios';

const bdbOracleUrl = "http://13.81.13.189:4000/"

export class MyChaincode extends Chaincode {

    async queryById(stubHelper: StubHelper, args: string[]): Promise<any> {
        console.log(args);
        const verifiedArgs = await Helpers.checkArgs<{ key: string }>(args[0], Yup.object()
            .shape({
                key: Yup.string().required(),
            }));

        const data = await stubHelper.getStateAsObject(verifiedArgs.key);

        if (!data) {
            throw new NotFoundError('Data does not exist');
        }

        return data;
    }

    async initLedger(stubHelper: StubHelper, args: string[]) {
        const callback = {
            callback: 'function (data) {if (data.number > 0) {return \"Number is greater than 0. Number is \" + data.number;} else if (data.number== 0) {return \"Number is 0.\";} else {return \"Number is less than 0. Number is \" + data.number;}}',
            doctype: 'callback'
        };

        await stubHelper.putState('CALLBACK1', callback);
        console.log('Added callback <--> ', callback);
    }

    async queryOracle(stubHelper: StubHelper, args: string[]) {
        console.log(args);
        const verifiedArgs = await Helpers.checkArgs<any>(args[0], Yup.object()
            .shape({
                assetId: Yup.string().required()
            }));

        let retrievedCallback = await stubHelper.getStateAsObject('CALLBACK1');
        console.log('CALLBACK');
        console.log('Ret Callback:  ', retrievedCallback['callback']);
        let callbackExtract = String(retrievedCallback['callback']);
        console.log('extract ', callbackExtract);
        let body = { query: verifiedArgs.assetId, callback: callbackExtract };
        console.log(JSON.stringify(body));
        const url = bdbOracleUrl + 'oraclequery';
        console.log(url);
        await axios.post(url, body);
    }

    async saveResult(stubHelper: StubHelper, args: string[]) {
        console.log(args);
        let response = JSON.parse(args[0]);

        console.log(response.data.assetData);
        console.log(response.data.status);
        stubHelper.setEvent('Call_executed', response.data);

        await stubHelper.putState(response.data.id, response.data);
    }
}