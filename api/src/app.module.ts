import { Module } from '@nestjs/common';
import { HelperModule } from './helper/helper.module';
import { DbModule } from './db/db.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './routes/auth/auth.module';
import { UserModule } from './routes/user/user.module';
import { ProjectModule } from './routes/project/project.module';
import { CollectionModule } from './routes/collection/collection.module';
import { BlacklistModule } from './routes/blacklist/blacklist.module';

@Module({
  imports: [
    HelperModule,
    DbModule,
    AuthModule,
    UserModule,
    ProjectModule,
    CollectionModule,
    BlacklistModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
