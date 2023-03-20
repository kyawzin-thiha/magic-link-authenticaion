import { Module } from '@nestjs/common';
import { HelperModule } from './helper/helper.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [HelperModule, DbModule],
})
export class AppModule { }
