import { All, Body, Controller, Next, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtAuth } from './jwt-auth.guard';

@ApiTags('Авторизация')
@Controller('/')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/auth/login')
    login(@Body() dto: AuthUserDto) {
        return this.authService.login(dto)
    }

    @UseGuards(JwtAuth)
    @All('/*')
    all(@Next() next: any) {
        return next();
    }

}
