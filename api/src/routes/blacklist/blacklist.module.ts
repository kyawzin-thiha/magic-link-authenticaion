import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { HelperModule } from 'src/helper/helper.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [HelperModule, DbModule],
  providers: [BlacklistService],
  controllers: [BlacklistController],
})
export class BlacklistModule { }
