import { Injectable, HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProjectDbService } from 'src/db/project.service';

@Injectable()
export class ProjectService {
    constructor(
        private readonly project: ProjectDbService,
    ) { }

    async getProjectByUniqueName(uniqueName: string, ownerId: string) {
        const [project, dbError] = await this.project.getByUniqueName(
            uniqueName,
            ownerId,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return project;
    }

    async getAllProjects(ownerId: string) {
        const [projects, dbError] = await this.project.getByOwnerId(ownerId);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return projects;
    }

    async createProject(
        ownerId: string,
        name: string,
        description: string,
        hostUrl: string,
        successUrl: string,
    ) {
        const uniqueName = `p_${name
            .replace(/ /g, '')
            .toLowerCase()}_${randomUUID().replace(/-/g, '')}}`;
        const uniqueKey = `s_${randomUUID().replace(/-/g, '')}`;
        const [project, dbError] = await this.project.create(
            ownerId,
            name,
            uniqueName,
            description,
            uniqueKey,
            hostUrl,
            successUrl,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return project;
    }

    async updateProject(
        id: string,
        name: string,
        description: string,
        hostUrl: string,
        successUrl: string,
    ) {
        const dbError = await this.project.update(
            id,
            name,
            description,
            hostUrl,
            successUrl,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return true;
    }

    async deleteProject(id: string) {
        const dbError = await this.project.delete(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }
    }
}
