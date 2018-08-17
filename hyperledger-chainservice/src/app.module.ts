import { EnvConfig } from './common/config/env';
import { Log } from './common/utils/logging/log.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PingModule } from './ping/ping.module';
import { NumberModule } from './numbers/number.module';
import { CoreModule } from './core/core.module';

@Module({
    imports: [
        CoreModule,
        PingModule,
        NumberModule
    ]
})
export class ApplicationModule {
    constructor() {
        // list env keys in console
        for (let propName of Object.keys(EnvConfig)) {
            Log.config.debug(`${propName}:  ${EnvConfig[propName]}`);
        }

    }
}