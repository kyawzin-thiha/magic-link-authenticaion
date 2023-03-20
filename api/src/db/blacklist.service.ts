import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/helper/prisma.service';
import { BlacklistDto, BlacklistsDto } from 'src/types/database.dto';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class BlacklistDbService {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        projectId: string,
        email: string,
        isActive: boolean,
    ): Promise<[BlacklistDto, ErrorDto]> {
        try {
            const blacklist = await this.prisma.blacklist.create({
                data: {
                    email,
                    isActive,
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
            return [blacklist, null];
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return [null, { message: 'Email already exists', statusCode: 400 }];
            }
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getById(id: string): Promise<[BlacklistDto, ErrorDto]> {
        try {
            const blacklist = await this.prisma.blacklist.findUnique({
                where: {
                    id,
                },
                include: {
                    project: true,
                },
            });
            if (!blacklist) {
                return [null, { message: 'Blacklist not found', statusCode: 404 }];
            }
            return [blacklist, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByEmail(
        email: string,
        projectId: string,
    ): Promise<[BlacklistDto, ErrorDto]> {
        try {
            const blacklist = await this.prisma.blacklist.findFirst({
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
            return [blacklist, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByProjectId(projectId: string): Promise<[BlacklistsDto, ErrorDto]> {
        try {
            const blacklist = await this.prisma.blacklist.findMany({
                where: {
                    projectId,
                },
                include: {
                    project: true,
                },
            });
            return [blacklist, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async activate(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.blacklist.update({
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
            await this.prisma.blacklist.update({
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

    async update(
        id: string,
        email: string,
        isActive: boolean,
    ): Promise<ErrorDto> {
        try {
            await this.prisma.blacklist.update({
                where: {
                    id,
                },
                data: {
                    email,
                    isActive,
                },
            });
            return null;
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return { message: 'Email already exists', statusCode: 400 };
            }
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async delete(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.blacklist.delete({
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
