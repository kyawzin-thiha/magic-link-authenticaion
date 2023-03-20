import { Injectable, HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BlacklistDbService } from 'src/db/blacklist.service';
import { CollectionDbService } from 'src/db/collection.service';
import { ProjectDbService } from 'src/db/project.service';
import { JwtTokenService } from 'src/helper/jwt.service';
import { MailService } from 'src/helper/mail.service';
import { RedisService } from 'src/helper/redis.service';

@Injectable()
export class MagicLinkService {
    constructor(
        private readonly project: ProjectDbService,
        private readonly collections: CollectionDbService,
        private readonly blacklist: BlacklistDbService,
        private readonly jwt: JwtTokenService,
        private readonly redis: RedisService,
        private readonly mail: MailService,
    ) { }

    private async sendMail(
        to: string,
        template: string,
        data: { subject: string; url: string },
    ) {
        const mailError = await this.mail.sendMail(to, template, data);

        if (mailError) {
            throw new HttpException(mailError.message, mailError.statusCode);
        }
    }

    async getUser(id: string) {
        const [user, dbError] = await this.collections.getById(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return user;
    }

    async getProjectData(uniqueKey: string) {
        const [projectId, dbError] = await this.project.getIdByCredential(
            uniqueKey,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return projectId;
    }

    async requestLogin(usernameOrEmail: string, projectId: string) {
        const [user, dbError] = await this.collections.getByUsernameOrEmail(
            usernameOrEmail,
            projectId,
        );

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        if (!user.isActive) {
            throw new HttpException('Deactivated by owner', 400);
        }

        this.sendLoginEmail(user.email, user.id, user.projectId, user.project.name);

        return user;
    }

    async requestRegister(username: string, email: string, projectId: string) {
        const [isBlacklisted, blacklistDbError] = await this.blacklist.getByEmail(
            email,
            projectId,
        );

        if (blacklistDbError) {
            throw new HttpException(
                blacklistDbError.message,
                blacklistDbError.statusCode,
            );
        }

        if (isBlacklisted) {
            throw new HttpException('Email is blacklisted', 400);
        }

        const [user, userDbError] = await this.collections.create(
            projectId,
            username,
            email,
        );

        if (userDbError) {
            throw new HttpException(userDbError.message, userDbError.statusCode);
        }

        this.sendLoginEmail(user.email, user.id, user.projectId, user.project.name);

        return user;
    }

    async login(token: string) {
        const userData = await this.redis.get(token);
        const { userId, projectId } = JSON.parse(userData);

        const [project, dbError] = await this.project.getById(projectId);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        const [jwtToken, jwtError] = this.jwt.sign({ id: userId, projectId }, '7d');

        if (jwtError) {
            throw new HttpException(jwtError.message, jwtError.statusCode);
        }

        return [jwtToken, project.credentials.successUrl];
    }

    async sendLoginEmail(
        email: string,
        userId: string,
        projectId: string,
        name: string,
    ) {
        const loginToken = randomUUID();

        await this.redis.set(
            loginToken,
            JSON.stringify({ userId, projectId }),
            60 * 60,
        );

        const emailLoginTemplate = process.env.EMAIL_LOGIN_TEMPLATE_ID;
        const emailLoginURL = `${process.env.EMAIL_LOGIN_URL}?token=${loginToken}`;
        const emailLoginData = {
            subject: 'Login to your account',
            name,
            url: emailLoginURL,
        };

        await this.sendMail(email, emailLoginTemplate, emailLoginData);
    }

    generateToken(id: string, projectId?: string) {
        const [token, jwtError] = this.jwt.sign({ id, projectId }, '20m');

        if (jwtError) {
            throw new HttpException(jwtError.message, jwtError.statusCode);
        }

        return token;
    }

    verifyToken(token: string) {
        const [decoded, jwtError] = this.jwt.verify(token);

        if (jwtError) {
            throw new HttpException(jwtError.message, jwtError.statusCode);
        }

        return decoded;
    }
}
