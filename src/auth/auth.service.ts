import { HttpException, Injectable, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService: JwtService) {}

    async login(dto: AuthUserDto) {
       if(!dto.login || !dto.password)
            throw new UnauthorizedException({message: 'Пароль или логин небыли введены' })
        
        const user = await this.userService.getUserByLogin(dto.login)
        if(!user)
            throw new UnauthorizedException({message: 'Некорректный логин' })

        const passwordEquals = await bcrypt.compare(dto.password, user.password)

        if(!passwordEquals)
            throw new UnauthorizedException({message: 'Некорректный пароль' })
        return user
    }

    async registration( userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if(candidate) {
            throw new HttpException(
                'Пользователь с таким email уже существует', 
                HttpStatus.BAD_REQUEST)
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword})
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.role} 
        return {
            token: this.jwtService.sign(payload)
        } 
    }
}
