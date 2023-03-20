import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/helper/prisma.service';
import { ProjectDto, ProjectWithCollectionsDto } from 'src/types/database.dto';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class ProjectDbService {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        ownerId: string,
        name: string,
        uniqueName: string,
        description: string,
        uniqueKey: string,
        hostUrl: string,
        successUrl: string,
    ): Promise<[ProjectDto, ErrorDto]> {
        try {
            const project = await this.prisma.project.create({
                data: {
                    name,
                    uniqueName,
                    description,
                    owner: {
                        connect: {
                            id: ownerId,
                        },
                    },
                    credentials: {
                        create: {
                            uniqueKey,
                            hostUrl,
                            successUrl,
                        },
                    },
                },
                include: {
                    owner: true,
                    credentials: true,
                },
            });
            return [project, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getById(id: string): Promise<[ProjectWithCollectionsDto, ErrorDto]> {
        try {
            const project = await this.prisma.project.findUnique({
                where: {
                    id,
                },
                include: {
                    owner: true,
                    credentials: true,
                    collections: true,
                    blacklists: true,
                },
            });
            if (!project) {
                return [null, { message: 'Project not found', statusCode: 404 }];
            }
            return [project, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByUniqueName(
        uniqueName: string,
        ownerId: string,
    ): Promise<[ProjectWithCollectionsDto, ErrorDto]> {
        try {
            const project = await this.prisma.project.findFirst({
                where: {
                    uniqueName,
                    owner: {
                        id: ownerId,
                    },
                },
                include: {
                    owner: true,
                    credentials: true,
                    collections: true,
                    blacklists: true,
                },
            });
            if (!project) {
                return [null, { message: 'Project not found', statusCode: 404 }];
            }
            return [project, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByOwnerId(ownerId: string): Promise<[ProjectDto[], ErrorDto]> {
        try {
            const projects = await this.prisma.project.findMany({
                where: {
                    owner: {
                        id: ownerId,
                    },
                },
                include: {
                    owner: true,
                    credentials: true,
                    _count: {
                        select: {
                            collections: {
                                where: {
                                    isActive: true,
                                },
                            },
                            blacklists: {
                                where: {
                                    isActive: true,
                                },
                            },
                        },
                    },
                },
            });
            return [projects, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getIdByCredential(
        uniqueKey: string,
    ): Promise<[string | null, ErrorDto]> {
        try {
            const project = await this.prisma.project.findFirst({
                where: {
                    credentials: {
                        uniqueKey,
                    },
                },
                select: {
                    id: true,
                },
            });
            if (!project) {
                return [null, { message: 'Project not found', statusCode: 404 }];
            }
            return [project.id, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async update(
        id: string,
        name: string,
        description: string,
        hostUrl: string,
        successUrl: string,
    ): Promise<ErrorDto> {
        try {
            await this.prisma.project.update({
                where: {
                    id,
                },
                data: {
                    name,
                    description,
                    credentials: {
                        update: {
                            hostUrl,
                            successUrl,
                        },
                    },
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.project.delete({
                where: {
                    id,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }
}
