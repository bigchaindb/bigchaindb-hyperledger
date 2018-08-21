import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AppInsights } from 'applicationinsights-js'
import { OracleDto } from './oracle.model';
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
        AppInsights.downloadAndSetup({ instrumentationKey: String(process.env.APPLICATION_INSIGHTS_KEY) });
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
        AppInsights.trackEvent("ChainServiceCallOracle", { assetId: oracleDto.assetId, callback: oracleDto.callback });
        return this.requestHelper.invokeRequest(ChainMethod.queryOracle, oracleDto, 'admin', 'Call_executed',false)
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
