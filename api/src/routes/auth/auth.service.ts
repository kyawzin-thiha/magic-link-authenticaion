import { HttpException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AccountDbService } from 'src/db/account.service';
import { UserDbService } from 'src/db/user.service';
import { AvatarService } from 'src/helper/avatar.service';
import { AwsService } from 'src/helper/aws.service';
import { BcryptService } from 'src/helper/bcrypt.service';
import { JwtTokenService } from 'src/helper/jwt.service';
import { MailService } from 'src/helper/mail.service';
import { RedisService } from 'src/helper/redis.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly account: AccountDbService,
		private readonly user: UserDbService,
		private readonly aws: AwsService,
		private readonly bcrypt: BcryptService,
		private readonly avatar: AvatarService,
		private readonly mail: MailService,
		private readonly token: JwtTokenService,
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

	async getAllUsernames() {
		const [usernames, dbError] = await this.account.getAllUsernames();

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}

		return usernames;
	}

	async validateUser(username: string, pass: string) {
		const [user, dbError] = await this.account.getByUsernameOrEmail(username);
		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}
		const isPasswordCorrect = this.bcrypt.compareValue(pass, user.password);

		if (!isPasswordCorrect) {
			throw new HttpException('Invalid password', 400);
		}
		return user;
	}

	async registerUser(
		username: string,
		password: string,
		name: string,
		email: string,
	) {
		const avatarString = this.avatar.createAvatar(username);

		const [avatarData, awsError] = await this.aws.uploadString(
			username,
			'avatar.svg',
			avatarString,
			'image/svg+xml',
		);

		if (awsError) {
			throw new HttpException(awsError.message, awsError.statusCode);
		}

		const hashedPassword = this.bcrypt.hashValue(password);

		const [user, dbError] = await this.account.create(
			username,
			hashedPassword,
			name,
			email,
			avatarData.url,
		);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}

		return user;
	}

	async verifyEmail(token: string) {
		const userId = await this.redis.get(token);

		if (!userId) {
			throw new HttpException('Invalid or expired token', 400);
		}

		const dbError = await this.user.verifyEmail(userId);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}
	}

	async updatePassword(id: string, password: string) {
		const hashedPassword = this.bcrypt.hashValue(password);

		const dbError = await this.account.updatePassword(id, hashedPassword);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}
	}

	async resetPassword(token: string, password: string) {
		const accountId = await this.redis.get(token);

		if (!accountId) {
			throw new HttpException('Invalid or expired token', 400);
		}

		const hashedPassword = this.bcrypt.hashValue(password);

		const dbError = await this.account.updatePassword(
			accountId,
			hashedPassword,
		);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}
	}

	async deleteAccount(id: string) {
		const dbError = await this.account.deleteAccount(id);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}
	}

	generateToken(payload: { id: string; username: string; userId: string }) {
		const [token, jwtError] = this.token.sign(payload, '7d');

		if (jwtError) {
			throw new HttpException(jwtError.message, jwtError.statusCode);
		}

		return token;
	}

	async sendEmailVerificationEmail(userId: string, email?: string) {
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

	async sendPasswordResetEmail(usernameOrEmail: string) {
		const [account, dbError] = await this.account.getByUsernameOrEmail(
			usernameOrEmail,
		);

		if (dbError) {
			throw new HttpException(dbError.message, dbError.statusCode);
		}

		const passwordResetToken = randomUUID();

		await this.redis.set(passwordResetToken, account.id, 60 * 60 * 24);

		const passwordResetTemplateId = process.env.PASSWORD_RESET_TEMPLATE_ID;
		const passwordResetURL = `${process.env.PASSWORD_RESET_URL}?key=${passwordResetToken}`;
		const passwordResetData = {
			subject: 'Welcome to the team! Please verify your email address',
			url: passwordResetURL,
		};

		await this.sendMail(
			account.user.email,
			passwordResetTemplateId,
			passwordResetData,
		);
	}
}
