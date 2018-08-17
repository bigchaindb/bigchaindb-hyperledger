import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NumberDto } from './number.model';
import { RequestHelper } from '../core/chain/requesthelper';
import { IAuthUser } from '../core/authentication/interfaces/authenticateduser';
import { InvokeResult } from '../common/utils/invokeresult.model';
import { ChainMethod } from '../chainmethods.enum';

@Injectable()
export class NumberService {
    /**
     * Creates an instance of NumberService.
     * @param {RequestHelper} requestHelper
     * @memberof NumberService
     */
    constructor(private requestHelper: RequestHelper) {
    }

    /**
     * Get number by id
     * 
     * @returns {Promise<NumberDto>}
     * @memberof NumberService
     */
    getValueForAsset(id: string): Promise<NumberDto> {
        return this.requestHelper.invokeRequest(ChainMethod.queryNumber, {query:id}, 'admin', 'Call_executed',false)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Create new number
     *
     * @param {NumberDto} numberDto
     * @returns {Promise<InvokeResult>}
     * @memberof NumberService
     */
    getValueForAssetWithCallback(numberDto: NumberDto): Promise<InvokeResult> {
        return this.requestHelper.invokeRequest(ChainMethod.queryNumber, numberDto, 'admin', 'Call_executed',false)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /** 
     * Get data by id 
     * 
     * @returns {Promise<CarDto>} 
     * @memberof CarService 
     */ 
    getById(): Promise<any> { 
        return this.requestHelper.queryRequest(ChainMethod.queryById, {key: 'PAYLOAD1'}).then( 
            (data) => { 
                if (!data) { 
                    throw new NotFoundException('Data does not exist!'); 
                } 
                return data; 
            }, 
            (error) => { 
                throw new InternalServerErrorException(error); 
            }, 
        ); 
    } 
}
