import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorDto } from 'src/types/error.dto';
import { ProjectTokenDto, TokenDto } from 'src/types/system.dto';

@Injectable()
export class JwtTokenService {
	constructor(private readonly jwtService: JwtService) { }

	sign(payload: TokenDto | ProjectTokenDto, expiresIn = '1d'): [string | null, ErrorDto] {
		try {
			const token = this.jwtService.sign(payload, {
				expiresIn,
			});
			return [token, null];
		} catch (error) {
			return [null, { message: 'Internal server error', statusCode: 500 }];
		}
	}

	verify(token: string): [TokenDto, ErrorDto] {
		try {
			const data = this.jwtService.verify(token);
			return [data, null];
		} catch (error) {
			return [null, { message: 'Internal server error', statusCode: 500 }];
		}
	}
}
