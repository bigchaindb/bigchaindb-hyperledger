import { Body, Controller, Get, NotFoundException, Param, Post, Req } from '@nestjs/common';
import { OracleService } from './oracle.service';
import { OracleResponseDto } from './oracleResponse.model';
import { OracleDto } from './oracle.model';
import { ApiOAuth2Auth, ApiOperation, ApiResponse, ApiUseTags, ApiImplicitHeader } from '@nestjs/swagger';
import { InvokeResult } from '../common/utils/invokeresult.model';

@ApiUseTags('oracle')
@Controller('oracle')
export class OracleController {

    /**
     * Creates an instance of OracleController.
     * @memberof OracleController
     * @param {OracleService} oracleService
     */
    constructor(private oracleService: OracleService) {
    }

    /**
     * Get value from oracle for asset with callback
     *
     * @param {OracleDto} oracleDto
     * @param req
     * @returns {*}
     * @memberof OracleController
     */
    @Post()
    @ApiOperation({title: 'Get value for asset with callback from oracle'})
    @ApiResponse({
        status: 201,
        description: 'The oracle response has been successfully retrieved and stored.',
    })
    getValueForAssetWithCallback(@Body() oracleDto: OracleDto): Promise<InvokeResult> {
        return this.oracleService.getValueForAssetWithCallback(oracleDto);
    }

    /**
     * Post response from oracle in blockchain
     *
     * @param {OracleResponseDto} oracleResponseDto
     * @param req
     * @returns {*}
     * @memberof OracleController
     */
    @Post('response')
    @ApiOperation({title: 'Post response from oracle in blockchain'})
    @ApiResponse({
        status: 201,
        description: 'The oracle response has been successfully stored.',
    })
    saveOracleResponse(@Body() oracleResponseDto: OracleResponseDto): Promise<InvokeResult> {
        return this.oracleService.saveOracleResponse(oracleResponseDto);
    }

    /** 
     * Get stored oracle data object by id (asset)
     * 
     * @returns {Promise<OracleDto[]>} 
     * @memberof OracleController 
     * @param id 
     */ 
    @Get(':id') 
    @ApiOperation({title: 'Get an oracle object by id'}) 
    @ApiResponse({ 
        status: 200, 
        description: 'Returns an oracle data object', 
        type: {}, 
    }) 
    @ApiResponse({ 
        status: 404, 
        description: 'Oracle data object does not exist!', 
        type: NotFoundException 
    }) 
    getById(@Param('id') id: string): Promise<any> { 
        return this.oracleService.getById(id); 
    }
}