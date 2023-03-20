import { Injectable, HttpException } from '@nestjs/common';
import { CollectionDbService } from 'src/db/collection.service';

@Injectable()
export class CollectionService {
    constructor(private readonly collection: CollectionDbService) { }

    async activateCollection(id: string) {
        const dbError = await this.collection.activate(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }
    }

    async deactivateCollection(id: string) {
        const dbError = await this.collection.deactivate(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }
    }

    async deleteCollection(id: string) {
        const dbError = await this.collection.delete(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }
    }
}
