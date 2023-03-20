import { ProjectDbService } from './project.service';
import { Module } from '@nestjs/common';
import { HelperModule } from 'src/helper/helper.module';
import { AccountDbService } from './account.service';
import { UserDbService } from './user.service';
import { CollectionDbService } from './collection.service';
import { BlacklistDbService } from './blacklist.service';

@Module({
    imports: [HelperModule],
    providers: [AccountDbService, UserDbService, ProjectDbService, CollectionDbService, BlacklistDbService],
    exports: [AccountDbService, UserDbService, ProjectDbService, CollectionDbService, BlacklistDbService],
})
export class DbModule { }
