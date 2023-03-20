import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtTokenService } from 'src/helper/jwt.service';

@Injectable()
export class MagicLinkGuard implements CanActivate {
    constructor(
        private readonly jwt: JwtTokenService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token =
            request.cookies?.['project'] || request.signedCookies?.['project'];
        if (!token) {
            return false;
        }

        const [project, jwtError] = this.jwt.verify(token);

        if (!project || jwtError) {
            return false;
        }

        request.project = project;

        return true;
    }
}
