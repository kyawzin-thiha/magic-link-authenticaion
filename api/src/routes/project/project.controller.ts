import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
    constructor(private readonly project: ProjectService) { }

    @Get('/get/:uniqueName')
    async getProjectByUniqueName(
        @Request() req,
        @Param('uniqueName') uniqueName: string,
    ) {
        const { userId } = req.user;

        const project = await this.project.getProjectByUniqueName(
            uniqueName,
            userId,
        );

        return project;
    }

    @Get('get-all')
    async getAllProjects(@Request() req) {
        const { userId } = req.user;

        const projects = await this.project.getAllProjects(userId);

        return projects;
    }

    @Post('create')
    async createProject(
        @Request() req,
        @Body()
        data: {
            name: string;
            description: string;
            hostUrl: string;
            successUrl: string;
        },
    ) {
        const { userId } = req.user;

        const project = await this.project.createProject(
            userId,
            data.name,
            data.description,
            data.hostUrl,
            data.successUrl,
        );

        return project;
    }

    @Put('update/:id')
    async updateProject(
        @Param('id') id: string,
        @Body()
        data: {
            name: string;
            description: string;
            hostUrl: string;
            successUrl: string;
        },
    ) {
        const project = await this.project.updateProject(
            id,
            data.name,
            data.description,
            data.hostUrl,
            data.successUrl,
        );

        return project;
    }

    @Delete('delete/:id')
    async deleteProject(@Param('id') id: string) {
        await this.project.deleteProject(id);

        return;
    }
}
