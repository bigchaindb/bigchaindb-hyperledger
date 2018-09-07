import { ApiModelProperty } from '@nestjs/swagger';

export class OracleResponseDto {
    @ApiModelProperty()
    readonly data: any;
}