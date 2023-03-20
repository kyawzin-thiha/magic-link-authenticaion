import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MagicLinkController } from './magicLink.controller';
import { MagicLinkService } from './magicLink.service';
import { HelperModule } from 'src/helper/helper.module';
import { DbModule } from 'src/db/db.module';
import * as cors from 'cors';
@Module({
  imports: [HelperModule, DbModule],
  controllers: [MagicLinkController],
  providers: [MagicLinkService],
})
export class MagicLinkModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('yes executed app confogure');
    consumer
      .apply(
        cors({
          origin: '*',
          credentials: false,
        }),
      )
      .exclude('auth/*')
      .forRoutes('*');
  }
}
