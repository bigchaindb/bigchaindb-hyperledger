import { Chaincode, Helpers, NotFoundError, StubHelper } from '@theledger/fabric-chaincode-utils';
import * as Yup from 'yup';
import axios from 'axios';

export class MyChaincode extends Chaincode {

    async queryById(stubHelper: StubHelper, args: string[]): Promise<any> {
        console.log(args);
        const verifiedArgs = await Helpers.checkArgs<{ key: string }>(args[0], Yup.object()
            .shape({
                key: Yup.string().required(),
            }));

        const data = await stubHelper.getStateAsObject(verifiedArgs.key); //get the car from chaincode state

        if (!data) {
            throw new NotFoundError('Data does not exist');
        }

        return data;
    }

    async initLedger(stubHelper: StubHelper, args: string[]) {

        let cars = [{
            make: 'Toyota',
            model: 'Prius',
            color: 'blue',
            owner: 'Tomoko'
        }, {
            make: 'Ford',
            model: 'Mustang',
            color: 'red',
            owner: 'Brad'
        }, {
            make: 'Hyundai',
            model: 'Tucson',
            color: 'green',
            owner: 'Jin Soo'
        }, {
            make: 'Volkswagen',
            model: 'Passat',
            color: 'yellow',
            owner: 'Max'
        }, {
            make: 'Tesla',
            model: 'S',
            color: 'black',
            owner: 'Adriana'
        }, {
            make: 'Peugeot',
            model: '205',
            color: 'purple',
            owner: 'Michel'
        }, {
            make: 'Chery',
            model: 'S22L',
            color: 'white',
            owner: 'Aarav'
        }, {
            make: 'Fiat',
            model: 'Punto',
            color: 'violet',
            owner: 'Pari'
        }, {
            make: 'Tata',
            model: 'Nano',
            color: 'indigo',
            owner: 'Valeria'
        }, {
            make: 'Holden',
            model: 'Barina',
            color: 'violet',
            owner: 'Shotaro'
        }];

        for (let i = 0; i < cars.length; i++) {
            const car: any = cars[i];

            car.docType = 'car';
            await stubHelper.putState('CAR' + i, car);
            this.logger.info('Added <--> ', car);
        }

        const callback = {
            callback: 'function (data) {if (data.number > 0) {return \"Number is greater than 0. Number is \" + data.number;} else if (data.number== 0) {return \"Number is 0.\";} else {return \"Number is less than 0. Number is \" + data.number;}}',
            doctype: 'callback'
        };

        await stubHelper.putState('CALLBACK1', callback);
        this.logger.info('Added callback <--> ', callback);

    }

    async queryOracle(stubHelper: StubHelper, args: string[]) {
        console.log(args);

        const verifiedArgs = await Helpers.checkArgs<any>(args[0], Yup.object()
            .shape({
                assetId: Yup.string().required()
            }));

        let retrievedCallback = await stubHelper.getStateAsObject('CALLBACK1');
        console.log('CALLBACK');
        console.log(retrievedCallback);

        let body = {query: verifiedArgs.assetId, callback: retrievedCallback};
        console.log(verifiedArgs);    
            
        axios.post('http://13.81.13.189:4000/oraclequery', body);

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