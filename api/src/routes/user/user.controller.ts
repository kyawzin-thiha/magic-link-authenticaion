import { Body, Controller, Get, Put, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getUser(@Request() req) {
        const { userId } = req.user;

        const user = await this.userService.getUser(userId);

        return user;
    }

    @Put('update')
    async update(@Request() req, @Body() data: { name: string; email: string }) {
        const { userId } = req.user;

        await this.userService.update(userId, data.name, data.email);

        return;
    }
}
