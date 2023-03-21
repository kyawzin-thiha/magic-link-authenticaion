import { Module } from '@nestjs/common';
import { MagicLinkController } from './magicLink.controller';
import { MagicLinkService } from './magicLink.service';
import { HelperModule } from 'src/helper/helper.module';
import { DbModule } from 'src/db/db.module';
@Module({
  imports: [HelperModule, DbModule],
  controllers: [MagicLinkController],
  providers: [MagicLinkService],
})
export class MagicLinkModule { }
