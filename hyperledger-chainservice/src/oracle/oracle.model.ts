import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OracleDto {
    @IsString()
    @ApiModelProperty()
    readonly assetId: string;
}
