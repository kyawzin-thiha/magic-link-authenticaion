import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Request,
	Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Type } from 'src/decorators/type.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Get('re-authenticate')
	async reAuthenticate() {
		return;
	}

	@Type('Public')
	@Get('get-all-usernames')
	async getAllUsernames() {
		const usernames = await this.authService.getAllUsernames();

		return usernames;
	}

	@Type('Public')
	@Post('login')
	async login(
		@Body() data: { username: string; password: string },
		@Response({ passthrough: true }) res,
	) {
		const account = await this.authService.validateUser(
			data.username,
			data.password,
		);

		const token = this.authService.generateToken({
			id: account.id,
			userId: account.user.id,
			username: account.username,
		});

		res.cookie('token', token, {
			signed: process.env.NODE_ENV === 'production' ? true : false,
			httpOnly: process.env.NODE_ENV === 'production' ? true : false,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: 'None',
			domain: process.env.WEB_DOMAIN,
			maxAge: 60 * 60 * 24 * 7 * 1000,
		});

		return;
	}

	@Type('Public')
	@Post('register')
	async register(
		@Body()
		data: { username: string; password: string; email: string; name: string },
		@Response({ passthrough: true }) res,
	) {
		const account = await this.authService.registerUser(
			data.username,
			data.password,
			data.name,
			data.email,
		);

		await this.authService.sendEmailVerificationEmail(
			account.user.id,
			account.user.email,
		);

		const token = this.authService.generateToken({
			id: account.id,
			userId: account.user.id,
			username: account.username,
		});

		res.cookie('token', token, {
			signed: process.env.NODE_ENV === 'production' ? true : false,
			httpOnly: process.env.NODE_ENV === 'production' ? true : false,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: 'None',
			domain: process.env.WEB_DOMAIN,
			maxAge: 60 * 60 * 24 * 7 * 1000,
		});

		return;
	}

	@Post('request-email-verification')
	async requestEmailValidation(@Request() req) {
		const { userId } = req.user;

		await this.authService.sendEmailVerificationEmail(userId);

		return;
	}

	@Type('Public')
	@Put('verify-email')
	async verifyEmail(@Body() data: { token: string }) {
		await this.authService.verifyEmail(data.token);

		return;
	}

	@Type('Public')
	@Post('request-password-reset')
	async requestPasswordReset(@Body() data: { usernameOrEmail: string }) {
		await this.authService.sendPasswordResetEmail(data.usernameOrEmail);

		return;
	}

	@Type('Public')
	@Put('reset-password')
	async resetPassword(@Body() data: { token: string; password: string }) {
		await this.authService.resetPassword(data.token, data.password);

		return;
	}

	@Put('update-password')
	async updatePassword(@Request() req, @Body() data: { password: string }) {
		const { id } = req.user;

		await this.authService.updatePassword(id, data.password);

		return;
	}

	@Post('logout')
	async logout(@Response({ passthrough: true }) res) {
		res.clearCookie('token', {
			signed: process.env.NODE_ENV === 'production' ? true : false,
			httpOnly: process.env.NODE_ENV === 'production' ? true : false,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: 'None',
			domain: process.env.WEB_DOMAIN,
			maxAge: 60 * 60 * 24 * 7 * 1000,
		});

		return;
	}

	@Delete('delete-account')
	async deleteAccount(@Request() req, @Response({ passthrough: true }) res) {
		const { id } = req.user;

		await this.authService.deleteAccount(id);

		res.clearCookie('token', {
			signed: process.env.NODE_ENV === 'production' ? true : false,
			httpOnly: process.env.NODE_ENV === 'production' ? true : false,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			sameSite: 'None',
			domain: process.env.WEB_DOMAIN,
			maxAge: 60 * 60 * 24 * 7 * 1000,
		});
		return;
	}
}
