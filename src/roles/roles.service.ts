import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateAssetsDto } from './dto/update-assets.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleReprository: typeof Role) {
    } 

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleReprository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleReprository.findOne({where: {value}})
        return role;
    }

    async getRoleByPk(id: string) {
        const role = await this.roleReprository.findByPk(id)

        return role
    }

    async updateRoleByPk(dto: UpdateRoleDto) {
        const role = await this.roleReprository.findByPk(dto.id)
        
        if(!role) {
            throw new HttpException('Роли не найдено', HttpStatus.NOT_FOUND)
        }
        
        role.value = dto.value;
        role.description = dto.description;
        await role.save()
        
        return role
    }

    async getAllRoles() {
        const role = await this.roleReprository.findAll()
        return role;
    }

    async removeRoleById(id: number) {
        const isRole = await this.roleReprository.findByPk(id)
        if(isRole) {
            const role = await this.roleReprository.destroy({ where: {id}})
            return role
        } 

        throw new HttpException('Роль не найдена ', HttpStatus.NOT_FOUND)
    }

    async updateAssets(dto: UpdateAssetsDto) {
        console.log(dto)
        const role = await this.roleReprository.findByPk(dto.id);
        if(!role) 
            throw new HttpException('Не удалось найти роль', HttpStatus.NOT_FOUND)
        try {
            role.assets = JSON.stringify(dto.assets)
            await role.save()
        } catch(e) {
            console.log(e)
        }

        return dto.assets
    }
    
}
