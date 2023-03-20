import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/helper/prisma.service';
import { CollectionDto, CollectionsDto } from 'src/types/database.dto';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class CollectionDbService {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        projectId: string,
        username: string,
        email: string,
    ): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.create({
                data: {
                    username,
                    email,
                    project: {
                        connect: {
                            id: projectId,
                        },
                    },
                },
                include: {
                    project: true,
                },
            });
            return [collection, null];
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return [
                    null,
                    { message: 'Username or email already exists', statusCode: 400 },
                ];
            }
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getById(id: string): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.findUnique({
                where: {
                    id,
                },
                include: {
                    project: true,
                },
            });
            if (!collection) {
                return [null, { message: 'Collection not found', statusCode: 404 }];
            }
            return [collection, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByUsername(
        username: string,
        projectId: string,
    ): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.findFirst({
                where: {
                    username,
                    project: {
                        id: projectId,
                    },
                },
                include: {
                    project: true,
                },
            });
            if (!collection) {
                return [null, { message: 'Collection not found', statusCode: 404 }];
            }
            return [collection, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByEmail(
        email: string,
        projectId: string,
    ): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.findFirst({
                where: {
                    email,
                    project: {
                        id: projectId,
                    },
                },
                include: {
                    project: true,
                },
            });
            if (!collection) {
                return [null, { message: 'Collection not found', statusCode: 404 }];
            }
            return [collection, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByUsernameOrEmail(
        usernameOrEmail: string,
        projectId: string,
    ): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.findFirst({
                where: {
                    OR: [
                        {
                            username: usernameOrEmail,
                        },
                        {
                            email: usernameOrEmail,
                        },
                    ],
                    project: {
                        id: projectId,
                    },
                },
                include: {
                    project: true,
                },
            });
            if (!collection) {
                return [null, { message: 'Collection not found', statusCode: 404 }];
            }
            return [collection, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByProjectId(projectId: string): Promise<[CollectionsDto, ErrorDto]> {
        try {
            const collections = await this.prisma.collection.findMany({
                where: {
                    project: {
                        id: projectId,
                    },
                },
                include: {
                    project: true,
                },
            });
            return [collections, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getAllUsernames(): Promise<[string[] | null, ErrorDto]> {
        try {
            const usernames = await this.prisma.collection.findMany({
                select: {
                    username: true,
                },
            });
            return [usernames.map((collection) => collection.username), null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async updateEmail(
        id: string,
        email: string,
    ): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.update({
                where: {
                    id,
                },
                data: {
                    email,
                },
                include: {
                    project: true,
                },
            });
            return [collection, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async updateUsername(
        id: string,
        username: string,
    ): Promise<[CollectionDto, ErrorDto]> {
        try {
            const collection = await this.prisma.collection.update({
                where: {
                    id,
                },
                data: {
                    username,
                },
                include: {
                    project: true,
                },
            });
            return [collection, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async activate(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.collection.update({
                where: {
                    id,
                },
                data: {
                    isActive: true,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async deactivate(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.collection.update({
                where: {
                    id,
                },
                data: {
                    isActive: false,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.collection.delete({
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
