import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { HelperModule } from 'src/helper/helper.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [HelperModule, DbModule],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule { }
