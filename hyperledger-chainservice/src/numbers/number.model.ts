import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NumberDto {
    @IsString()
    @ApiModelProperty()
    readonly assetId: string;
    @IsString()
    @ApiModelProperty()
    readonly callback: string;
}
