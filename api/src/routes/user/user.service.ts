import { Injectable, HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AccountDbService } from 'src/db/account.service';
import { UserDbService } from 'src/db/user.service';
import { MailService } from 'src/helper/mail.service';
import { RedisService } from 'src/helper/redis.service';

@Injectable()
export class UserService {
    constructor(
        private readonly account: AccountDbService,
        private readonly user: UserDbService,
        private readonly mail: MailService,
        private readonly redis: RedisService,
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

    private async sendEmailVerificationEmail(userId: string, email?: string) {
        if (!email) {
            const [user, dbError] = await this.user.getById(userId);

            if (dbError) {
                throw new HttpException(dbError.message, dbError.statusCode);
            }

            email = user.email;
        }
        const emailVerificationToken = randomUUID();

        await this.redis.set(emailVerificationToken, userId, 60 * 60 * 24);

        const emailVerificationTemplateId =
            process.env.EMAIL_VERIFICATION_TEMPLATE_ID;
        const emailVerificationURL = `${process.env.EMAIL_VERIFICATION_URL}?key=${emailVerificationToken}`;
        const emailVerificationData = {
            subject: 'Welcome to the team! Please verify your email address',
            url: emailVerificationURL,
        };

        await this.sendMail(
            email,
            emailVerificationTemplateId,
            emailVerificationData,
        );
    }

    async getUser(id: string) {
        const [user, dbError] = await this.user.getById(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }

        return user;
    }

    async update(id: string, name: string, email: string) {
        if (name) {
            const dbError = await this.user.updateName(id, name);

            if (dbError) {
                throw new HttpException(dbError.message, dbError.statusCode);
            }
        }
        if (email) {
            const dbError = await this.user.updateEmail(id, email);
            if (dbError) {
                throw new HttpException(dbError.message, dbError.statusCode);
            }

            await this.sendEmailVerificationEmail(id, email);
        }
    }

    async deleteUser(id: string) {
        const dbError = await this.account.deleteAccount(id);

        if (dbError) {
            throw new HttpException(dbError.message, dbError.statusCode);
        }
    }
}
