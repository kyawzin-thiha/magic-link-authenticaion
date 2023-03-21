import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { MagicLinkService } from './magicLink.service';
import { Type } from 'src/decorators/type.decorator';
import { MagicLinkGuard } from 'src/guards/magicLink.guard';

@Controller('magic-link')
export class MagicLinkController {
    constructor(private readonly magicLinkService: MagicLinkService) { }

    @Get('user')
    async getUser(@Query('token') token: string) {
        const { id } = this.magicLinkService.verifyToken(token);

        const user = await this.magicLinkService.getUser(id);

        return { id: user.id, username: user.username, email: user.email };
    }

    @Type('Public')
    @Get('request-login-redirect/:uniqueKey')
    async requestLoginRedirect(
        @Param('uniqueKey') uniqueKey: string,
        @Response() res,
    ) {
        const projectId = await this.magicLinkService.getProjectData(uniqueKey);

        const token = this.magicLinkService.generateToken(projectId);
        res.cookie('project', token, {
            signed: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'None',
            domain: process.env.WEB_DOMAIN,
            maxAge: 60 * 20 * 1000,
        });

        const loginUrl = process.env.CLIENT_LOGIN_URL;
        res.redirect(loginUrl);
    }

    @Type('Public')
    @Get('request-register-redirect/:uniqueKey')
    async requestRegisterRedirect(
        @Param('uniqueKey') uniqueKey: string,
        @Response() res,
    ) {
        const projectId = await this.magicLinkService.getProjectData(uniqueKey);

        const token = this.magicLinkService.generateToken(projectId);
        res.cookie('project', token, {
            signed: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'None',
            domain: process.env.WEB_DOMAIN,
            maxAge: 60 * 20 * 1000,
        });

        const registerUrl = process.env.CLIENT_REGISTER_URL;
        res.redirect(registerUrl);
    }

    @Type('Public')
    @UseGuards(MagicLinkGuard)
    @Post('auth/login')
    async login(
        @Request() req,
        @Body() data: { username: string },
        @Response({ passthrough: true }) res,
    ) {
        const { id } = req.project;
        await this.magicLinkService.requestLogin(data.username, id);

        res.clearCookie('project', {
            signed: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'None',
            domain: process.env.WEB_DOMAIN,
            maxAge: 60 * 20 * 1000,
        });

        return;
    }

    @Type('Public')
    @UseGuards(MagicLinkGuard)
    @Post('auth/register')
    async register(
        @Request() req,
        @Body() data: { username: string; email: string },
        @Response({ passthrough: true }) res,
    ) {
        const { id } = req.project;
        await this.magicLinkService.requestRegister(data.username, data.email, id);

        res.clearCookie('project', {
            signed: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: process.env.NODE_ENV === 'production' ? true : false,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: 'None',
            domain: process.env.WEB_DOMAIN,
            maxAge: 60 * 60 * 1000,
        });
        return;
    }

    @Type('Public')
    @Get('email-login')
    async emailLogin(@Query('token') token: string, @Response() res) {
        const [jwtToken, redirectURl] = await this.magicLinkService.login(token);

        res.redirect(`http://${redirectURl}?token=${jwtToken}`);
    }
}
