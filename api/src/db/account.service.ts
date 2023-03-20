import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/helper/prisma.service';
import { AccountWithUserDto } from 'src/types/database.dto';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class AccountDbService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(username: string, password: string, name: string, email: string, avatar: string): Promise<[AccountWithUserDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.create({
                data: {
                    username,
                    password,
                    user: {
                        create: {
                            name,
                            email,
                            avatar
                        }
                    }
                },
                include: {
                    user: true
                }
            })
            return [account, null]
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                return [null, { message: "Username or email already exists", statusCode: 400 }]
            }
            return [null, { message: "Internal Server Error", statusCode: 500 }]
        }
    }

    async getById(id: string): Promise<[AccountWithUserDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.findUnique({
                where: {
                    id
                },
                include: {
                    user: true
                }
            })
            if (!account) {
                return [null, { message: "Account not found", statusCode: 404 }]
            }
            return [account, null]
        } catch (error) {
            return [null, { message: "Internal Server Error", statusCode: 500 }]
        }
    }

    async getByUsername(username: string): Promise<[AccountWithUserDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.findUnique({
                where: {
                    username
                },
                include: {
                    user: true
                }
            })
            if (!account) {
                return [null, { message: "Account not found", statusCode: 404 }]
            }
            return [account, null]
        } catch (error) {
            return [null, { message: "Internal Server Error", statusCode: 500 }]
        }
    }

    async getByEmail(email: string): Promise<[AccountWithUserDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    user: {
                        email
                    }
                },
                include: {
                    user: true
                }
            })
            if (!account) {
                return [null, { message: "Account not found", statusCode: 404 }]
            }
            return [account, null]
        } catch (error) {
            return [null, { message: "Internal Server Error", statusCode: 500 }]
        }
    }

    async getByUsernameOrEmail(usernameOrEmail: string): Promise<[AccountWithUserDto, ErrorDto]> {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    OR: [
                        {
                            username: usernameOrEmail
                        },
                        {
                            user: {
                                email: usernameOrEmail
                            }
                        }
                    ]
                },
                include: {
                    user: true
                }
            })
            if (!account) {
                return [null, { message: "Account not found", statusCode: 404 }]
            }
            return [account, null]
        } catch (error) {
            return [null, { message: "Internal Server Error", statusCode: 500 }]
        }
    }

    async getAllUsernames(): Promise<[string[], ErrorDto]> {
        try {
            const accounts = await this.prisma.account.findMany({
                select: {
                    username: true
                }
            })
            return [accounts.map(account => account.username), null]
        } catch (error) {
            return [null, { message: "Internal Server Error", statusCode: 500 }]
        }
    }

    async updateUsername(id: string, username: string): Promise<ErrorDto> {
        try {
            await this.prisma.account.update({
                where: {
                    id
                },
                data: {
                    username
                },
                include: {
                    user: true
                }
            })
            return null
        } catch (error) {
            return { message: "Internal Server Error", statusCode: 500 }
        }
    }

    async updatePassword(id: string, password: string): Promise<ErrorDto> {
        try {
            await this.prisma.account.update({
                where: {
                    id
                },
                data: {
                    password
                },
                include: {
                    user: true
                }
            })
            return null
        } catch (error) {
            return { message: "Internal Server Error", statusCode: 500 }
        }
    }

    async deleteAccount(id: string): Promise<ErrorDto> {
        try {
            await this.prisma.account.delete({
                where: {
                    id
                }
            })
            return null
        } catch (error) {
            return { message: "Internal Server Error", statusCode: 500 }
        }
    }
}