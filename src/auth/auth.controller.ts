import { Body, Controller, Header, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //access Token 생성
    @Post('token/access')
    postTokenAccess(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const newAccessToken = this.authService.rotateToken(token, false);

        /**
         * 신규 토큰 생성 리턴-
         * {accessToken : {token}}
         */

        return {
            accessToken: newAccessToken,
        };
    }

    @Post('token/refresh')
    postTokenRefresh(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const newRefreshToken = this.authService.rotateToken(token, true);

        /**
         * 신규 토큰 생성 리턴-
         * {accessToken : {token}}
         */
        return {
            refreshToken: newRefreshToken,
        };
    }

    //로그인
    @Post('login/email')
    loginEmail(
        @Headers('authorization') rawToken: string,
        // @Body('email') email: string,
        // @Body('password') password: string,
    ) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);
        const { email, password } = this.authService.decodeBasicToken(token);
        return this.authService.loginWithEmail({ email, password });
    }

    //회원가입
    @Post('login/register')
    registerEmail(
        @Body('email') email: string,
        @Body('nickname') nickname: string,
        @Body('password') password: string,
    ) {
        return this.authService.registerWithEmail({
            email,
            nickname,
            password,
        });
    }
}
