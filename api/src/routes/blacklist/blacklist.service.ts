import { HttpException, Injectable } from '@nestjs/common';
import { BlacklistDbService } from 'src/db/blacklist.service';

@Injectable()
export class BlacklistService {
    constructor(private readonly blacklist: BlacklistDbService) { }

    async createNewBlacklist(projectId: string, email: string, isActive: boolean) {
        const [blacklist, dbError] = await this.blacklist.create(projectId, email, isActive);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return blacklist;
    }

    async updateBlacklist(
        id: string,
        email: string,
        isActive: boolean,
    ) {
        const dbError = await this.blacklist.update(id, email, isActive);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return;
    }

    async activateBlacklist(id: string) {
        const dbError = await this.blacklist.activate(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return;
    }

    async deactivateBlacklist(id: string) {
        const dbError = await this.blacklist.deactivate(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return;
    }

    async deleteBlacklist(id: string) {
        const dbError = await this.blacklist.delete(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return;
    }
}
