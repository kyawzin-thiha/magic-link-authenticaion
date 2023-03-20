import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

@Controller('blacklist')
export class BlacklistController {
    constructor(private readonly blacklist: BlacklistService) { }

    @Post('create')
    async createNewBlacklist(
        @Body() data: { projectId: string; email: string; isActive: boolean },
    ) {
        const blacklist = await this.blacklist.createNewBlacklist(
            data.projectId,
            data.email,
            data.isActive,
        );

        return blacklist;
    }

    @Put('update/:id')
    async updateBlacklist(
        @Param('id') id: string,
        @Body() data: { email: string; isActive: boolean },
    ) {
        await this.blacklist.updateBlacklist(id, data.email, data.isActive);

        return;
    }

    @Put('activate/:id')
    async activateBlacklist(@Param('id') id: string) {
        await this.blacklist.activateBlacklist(id);

        return;
    }

    @Put('deactivate/:id')
    async deactivateBlacklist(@Param('id') id: string) {
        await this.blacklist.deactivateBlacklist(id);

        return;
    }

    @Delete('delete/:id')
    async deleteBlacklist(@Param('id') id: string) {
        await this.blacklist.deleteBlacklist(id);

        return;
    }
}
