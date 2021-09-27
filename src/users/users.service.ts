import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';

@Injectable() 
export class UsersService { 
 
    constructor(@InjectModel(User) private userRepository: typeof User, 
        private rolesService: RolesService,
        private documentService: DocumentsService) {}

    async createUser(dto: CreateUserDto, files?: any) {

        const tabel     =   await this.userRepository.findOne({where: { tabel: dto.tabel }})
        if(tabel) 
            throw new HttpException("Табельный номер не может повторяться", HttpStatus.BAD_REQUEST)

        const roles         =   await this.rolesService.getRoleByPk(dto.roles)
        const hashPassword  =   await bcrypt.hash(dto.password, 5);
        const user          =   await this.userRepository
            .create({...dto, password: hashPassword});
        
        if(roles) {
            user.rolesId = roles.id
            await user.save()
        }

        if(files.image)  {
            const ava = await this.saveImage(files)
            if(typeof ava == 'object') {
                user.image = ava.dataValues.path
                await user.$add('document', ava.id)
            }
        }
        
        if(files.document) {
            for(let file of files.document) {
                let docks = await this.documentService.saveDocument(file) 
                await user.$add('document', docks.id)
            }
        }
        
        return user  
    }

    async updateUser(dto: CreateUserDto, files: any) {
        const user = await this.userRepository.findByPk(Number(dto.id))
        if(!user)
            throw new HttpException('Пользователь или роль не найдены ', HttpStatus.NOT_FOUND)

        const tabel = await this.userRepository.findOne({where: { tabel: dto.tabel }})
        if(tabel && tabel.id != user.id) 
            throw new HttpException("Табельный номер не может повторяться", HttpStatus.EXPECTATION_FAILED)
        
        if(files.image) {
            const ava = await this.saveImage(files)
            if(typeof ava == 'object') {
                user.image = ava.dataValues.path
                await user.$add('document', ava.id)
            } else 
                user.image = ava
        }

        await user.save()

        if(dto.password && dto.password.length < 15) {
            const hashPassword  = await bcrypt.hash(dto.password, 5);
            user.password       = hashPassword
        }

        const roles =  await this.rolesService.getRoleByPk(dto.roles)
        if(roles) {
            user.rolesId = roles.id
            await user.save()
        }

        user.email          = dto.email
        user.initial        = dto.initial
        user.tabel          = dto.tabel
        user.dateWork       = dto.dateWork
        user.dateUnWork     = dto.dateUnWork
        user.birthday       = dto.birthday
        user.login          = dto.login
        user.adress         = dto.adress
        user.adressProps    = dto.adressProps
        user.phone          = dto.phone
        user.haracteristic  = dto.haracteristic
        user.primetch       = dto.primetch
        user.tabel          = dto.tabel 

        await user.save();

        if(files.document) {
            for(let file of files.document) {
                let docks = await this.documentService.saveDocument(file) 
                await user.$add('document', docks.id)
            }
        }

        await user.save();
        return user;
    }

    private async saveImage(files: any) {
        let fileName: any;
        if(files.image) {
            if(fileName = await this.documentService.saveDocument(files.image[0]))
                return fileName
            else 
                return 'ava_defolt.png' 
        } 

        return 'ava_defolt.png'
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

    async getUserByLogin(login: string) {
        const user = await this.userRepository.findOne({where: {login}, include: {all:true}})
        return user
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
