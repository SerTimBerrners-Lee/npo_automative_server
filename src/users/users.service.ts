import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable() 
export class UsersService { 

    constructor(@InjectModel(User) private userRepository: typeof User, 
        private rolesService: RolesService,
        private documentService: DocumentsService) {}

    async createUser(dto: CreateUserDto, files?: any) {
        let fileName: any;
        if(files.image) {
            if(fileName = await this.documentService.saveDocument(files.image[0], 'p')) {
                fileName = fileName.dataValues.path
            } else {
                fileName ='ava_defolt.gif' 
            }
        } else {
            fileName ='ava_defolt.gif' 
        }

        const tabel = await this.userRepository.findOne({where: { tabel: dto.tabel }})
        if(tabel) {
            throw new HttpException("Табельный номер не может повторяться", HttpStatus.BAD_REQUEST)
        }

        const roles = await this.rolesService.getRoleByPk(dto.roles)
        const user = await this.userRepository.create({...dto, image: fileName});
       
        await user.$set('roles', roles.id)
        user.roles = [roles]
        
        if(files.document) {
            for(let file of files.document) {
                let docks = await this.documentService.saveDocument(file, 'p') 
                await user.$add('document', docks.id)
            }
        }
        
        return user 
        //throw new HttpException('Пользователя не удалось добавить ', HttpStatus.BAD_REQUEST)
    }

    async getUser() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByPk(id: number) {
        const user = await this.userRepository.findByPk(id)

        return user
    }

    async removUserById(id: number) {
        return this.userRepository.destroy({where: {id}})
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.rolesService.getRoleByValue(dto.value);
        if(role && user) {
            await user.$add('role', role.id);
            return dto;
        }
 
        throw new HttpException('Пользователь или роль не найдены ', HttpStatus.NOT_FOUND)
    }

    async ban(dto: BanUserDto){
        const user = await this.userRepository.findByPk(dto.userId);
        if(!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        
        user.banned = !user.banned;
        user.banReason = dto.banReason; 
        await user.save();
        return user;
    }
}
