import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OracleResponseDto {
    @ApiModelProperty()
    readonly data: any;
}