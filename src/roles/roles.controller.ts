import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateAssetsDto } from './dto/update-assets.dto';

@ApiTags('Роли пользователей')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Post('/assets')
    updateAssetsRole(@Body() dto: UpdateAssetsDto) {
        return this.roleService.updateAssets(dto)
    }

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
        return this.roleService.updateRoleByPk(dto)
    }

    
}
