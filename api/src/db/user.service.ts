import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/helper/prisma.service';
import { UserDto, UserWithProjectsDto } from 'src/types/database.dto';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class UserDbService {
    constructor(private readonly prisma: PrismaService) { }

    async getById(id: string): Promise<[UserWithProjectsDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    projects: true,
                },
            });
            if (!user) {
                return [null, { message: 'User not found', statusCode: 404 }];
            }
            return [user, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByUsername(username: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    account: {
                        username,
                    },
                },
            });
            if (!user) {
                return [null, { message: 'User not found', statusCode: 404 }];
            }
            return [user, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async getByEmail(email: string): Promise<[UserDto, ErrorDto]> {
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email,
                },
            });
            if (!user) {
                return [null, { message: 'User not found', statusCode: 404 }];
            }
            return [user, null];
        } catch (error) {
            return [null, { message: 'Internal Server Error', statusCode: 500 }];
        }
    }

    async updateName(id: string, name: string): Promise<ErrorDto> {
        try {
            await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    name,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async updateEmail(id: string, email: string): Promise<ErrorDto> {
        try {
            await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    email,
                    isVerified: false,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async updateAvatar(id: string, avatar: string): Promise<ErrorDto> {
        try {
            await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    avatar,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }

    async verifyEmail(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    isVerified: true,
                },
            });
            return null;
        } catch (error) {
            return { message: 'Internal Server Error', statusCode: 500 };
        }
    }
}
