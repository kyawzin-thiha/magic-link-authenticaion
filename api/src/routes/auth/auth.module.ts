import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { HelperModule } from 'src/helper/helper.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
@Module({
    imports: [HelperModule, DbModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
