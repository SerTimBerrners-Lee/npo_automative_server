import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Роли пользователей')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @Get('/:value')
    getRole(@Param('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }

    @Get()
    getAllUser() {
        return this.roleService.getAllRoles()
    }

    @Delete('/:id')
    removeRoleById(@Param('id') id: number) {
        return this.roleService.removeRoleById(id)
    }
    
    @Post('/update')
    updateRoleByPk(@Body() dto: UpdateRoleDto) {
        console.log(dto)
        return this.roleService.updateRoleByPk(dto)
    }
}
