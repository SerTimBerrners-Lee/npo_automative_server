import { Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Delete, 
    UsePipes, 
    UseInterceptors, 
    UploadedFiles} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import _ from 'lodash'; 

@ApiTags('Пользователи') 
@Controller('users')
export class UsersController { 

    constructor(private userService: UsersService) {}

    @ApiOperation({summary: 'Создание пользователей'})
    @ApiResponse({status: 200, type: User})
    @UsePipes(ValidationPipe)
    @Post()
    //@UseInterceptors(FileInterceptor('file'))
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'document', maxCount: 20}
    ]))
    createUser(
        @Body() userDto: CreateUserDto, 
        @UploadedFiles() files: { image?: Express.Multer.File[], document?: Express.Multer.File[] }
    ) {
        return this.userService.createUser(userDto, files);
    }

    @ApiOperation({summary: 'Обновление пользователя'})
    @Post('/update')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'document', maxCount: 20}
    ]))
    updateUser(
        @Body() userDto: CreateUserDto, 
        @UploadedFiles() files: { image?: Express.Multer.File[], document?: Express.Multer.File[] }
    ) {
        return this.userService.updateUser(userDto, files);
    }

    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    //@Roles("ADMIN")
    //@UseGuards(RolesGuard) 
    @Get()
    getAll() {
        return this.userService.getUser();
    }

    @ApiOperation({summary: 'Удаление пользователя по ID'})
    @ApiResponse({status: 200, type: [User]})
    @Delete('/:id')
    removeUser(@Param('id') id: number) {
        return this.userService.removUserById(id);
    }

    @ApiOperation({summary: 'Выдача ролей'})
    @ApiResponse({status: 200})
    //@Roles("ADMIN")
    //@UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.userService.addRole(dto)
    }

    @ApiOperation({summary: 'Бан пользоватиелей'})
    @ApiResponse({status: 200})
    //@Roles("ADMIN")
    //@UseGuards(RolesGuard)
    @Post('/ban')
    banUser(@Body() dto: BanUserDto) {
        return this.userService.ban(dto)
    }
}
 