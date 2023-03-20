import {
    Controller,
    Delete,
    Param,
    Put,
} from '@nestjs/common';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
    constructor(private readonly collection: CollectionService) { }


    @Put('activate/:id')
    async activateCollection(@Param('id') id: string) {
        await this.collection.activateCollection(id);

        return;
    }

    @Put('deactivate/:id')
    async deactivateCollection(@Param('id') id: string) {
        await this.collection.deactivateCollection(id);

        return;
    }

    @Delete('delete/:id')
    async deleteCollection(@Param('id') id: string) {
        await this.collection.deleteCollection(id);

        return;
    }
}
