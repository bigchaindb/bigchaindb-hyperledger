import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OracleDto } from './oracle.model';
import { OracleResponseDto } from './oracleResponse.model';
import { RequestHelper } from '../core/chain/requesthelper';
import { InvokeResult } from '../common/utils/invokeresult.model';
import { ChainMethod } from '../chainmethods.enum';

@Injectable()
export class OracleService {
    /**
     * Creates an instance of OracleService.
     * @param {RequestHelper} requestHelper
     * @memberof OracleService
     */
    constructor(private requestHelper: RequestHelper) {
    }

    /**
     * Get oracle result by id
     * 
     * @returns {Promise<OracleDto>}
     * @memberof OracleService
     */
    getValueForAsset(id: string): Promise<OracleDto> {
        return this.requestHelper.invokeRequest(ChainMethod.queryOracle, {query:id}, 'admin', 'Call_executed',false)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Get value for asset with callback from oracle
     *
     * @param {OracleDto} oracleDto
     * @returns {Promise<InvokeResult>}
     * @memberof OracleService
     */
    getValueForAssetWithCallback(oracleDto: OracleDto): Promise<InvokeResult> {
        return this.requestHelper.invokeRequest(ChainMethod.queryOracle, oracleDto, 'admin', 'Call_executed',false)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Post response from oracle in blockchain
     *
     * @param {OracleResponseDto} oracleResponseDto
     * @returns {Promise<InvokeResult>}
     * @memberof OracleService
     */
    saveOracleResponse(oracleResponseDto: OracleResponseDto): Promise<InvokeResult> {
        return this.requestHelper.invokeRequest(ChainMethod.saveResult, oracleResponseDto, 'admin', 'Call_executed',false)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /** 
     * Get stored oracle data object by id 
     * 
     * @returns {Promise<OracleDto>} 
     * @memberof OracleService 
     */ 
    getById(id: string): Promise<any> { 
        return this.requestHelper.queryRequest(ChainMethod.queryById, {key: id}).then( 
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
