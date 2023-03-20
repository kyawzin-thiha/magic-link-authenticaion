import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { HelperModule } from 'src/helper/helper.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as cors from 'cors';
@Module({
    imports: [HelperModule, DbModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        console.log('yes executed app confogure');
        consumer
            .apply(
                cors({
                    origin: 'http://localhost:4000',
                    credentials: true,
                }),
            )
            .exclude({ path: 'auth/login', method: RequestMethod.ALL })
            .forRoutes('*'); // use .forRoutes('(.*)') if fastify
    }
}
