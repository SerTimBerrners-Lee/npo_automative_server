import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { ProviderService } from 'src/provider/provider.service';
import { domainToASCII } from 'url';
import { CreateInventaryDto } from './dto/create-inventary.dto';
import { PTInventary } from './inventary-pt.model';
import { PInventary } from './inventary-type.model';
import { Inventary } from './inventary.model';

@Injectable()
export class InventaryService { 
  constructor(
    @InjectModel(PInventary) private pInventaryReprository: typeof PInventary,
    @InjectModel(PTInventary) private ptInventaryReprository: typeof PTInventary, 
    @InjectModel(Inventary) private inventaryReprository: typeof Inventary,
    private providerService: ProviderService,
    private documentsService: DocumentsService
    ) {}

    async createPInventary(dto: any) {
      const inventary = await this.pInventaryReprository.create(dto)
      if(!inventary)
        throw new HttpException('Не удалось создать подтип', HttpStatus.BAD_GATEWAY)
      return await this.pInventaryReprository.findByPk(inventary.id, {include: {all: true}})
    }

    async updatePInventary(dto: any) {
      const inventary = await this.pInventaryReprository.findByPk(dto.id, {include: {all:true}})
      if(!inventary)
        throw new HttpException('Не удалось создать подтип', HttpStatus.BAD_GATEWAY)
      inventary.name = dto.name
      await inventary.save()
      return inventary
    }

    async getAllPInventary() {
      return await this.pInventaryReprository.findAll({include: {all: true}})
    }

    async deletePInventary(id: number) {
      const inventary = await this.pInventaryReprository.findByPk(id)
      if(inventary)
        return await this.pInventaryReprository.destroy({where: {id}})
    }

    async createPTInventary(dto: any) {
      const inventary = await this.ptInventaryReprository.create({
        name: dto.name,
        inventary_type_id: dto.inventary_type_id
      })
      if(!inventary)
        throw new HttpException('Не удалось создать подтип', HttpStatus.BAD_GATEWAY)
      return inventary
    }

    async updatePTInventary(dto: any) {
      const inventary = await this.ptInventaryReprository.findByPk(dto.id)
      if(!inventary)
        throw new HttpException('Не удалось обновить подтип', HttpStatus.BAD_GATEWAY)
      inventary.name = dto.name
      await inventary.save()
      return inventary
    }

    async getAllPTInventary() {
      return await this.ptInventaryReprository.findAll({include: {all: true}})
    }

    async deletePTInventary(id: number) {
      const inventary = await this.ptInventaryReprository.findByPk(id)
      if(inventary)
        return await this.ptInventaryReprository.destroy({where: {id}})
    }

    async getInventaryById(id: number) {
      const inventary =  await this.inventaryReprository.findByPk(id, {include: {all: true}})
      if(inventary) return inventary
    }

    async getAllInventary() {
      const inventary = await this.inventaryReprository.findAll()
      return inventary
    }

    async createNewInventary(dto: CreateInventaryDto, files: any) {
      const inventary = await this.inventaryReprository.create({name: dto.name})
      if(!inventary)
        throw new HttpException('Не удалось создать объект', HttpStatus.BAD_GATEWAY)
      const created_inventary = await this.inventaryReprository.findByPk(inventary.id, {include: {all: true}})
      
      return await this.upCreateInventary(dto, files, created_inventary)
    }

    async updateInventary(dto: CreateInventaryDto, files: any) {
      const inventary = await this.inventaryReprository.findByPk(dto.id, {include: {all: true}})
      if(!inventary)
        throw new HttpException('Не удалось обновить объект', HttpStatus.BAD_GATEWAY)
      
      return await this.upCreateInventary(dto, files, inventary)
    }

    private async upCreateInventary(dto: CreateInventaryDto, files: any, inventary: Inventary) {
      if(dto.name != '') inventary.name = dto.name
      if(dto.delivery_time != null) inventary.delivery_time = dto.delivery_time
      else inventary.delivery_time = 0
      if(dto.min_ostatok != null) inventary.min_ostatok = dto.min_ostatok
      else inventary.min_ostatok = 0
      if(dto.mount_used != null) inventary.mount_used = dto.mount_used
      else inventary.mount_used  = 0
      if(dto.description != null) inventary.description = dto.description
      else inventary.description  = ''

      if(dto.parent_t_id != null) {
        const type_inventary = await this.pInventaryReprository.findByPk(dto.parent_t_id)
        if(type_inventary) {
          inventary.parent_t_id = type_inventary.id
          await inventary.save()
        }
      }

      if(dto.parent_pt_id != null) {
        const pt_inventary = await this.ptInventaryReprository.findByPk(dto.parent_pt_id)
        if(pt_inventary) {
          inventary.parent_pt_id = pt_inventary.id
          await inventary.save()
        }
      }

      if(inventary.providers.length) {
        for(let prov of inventary.providers) {
          inventary.$remove('providers', prov.id)
        }
      }
      if(dto.providers != '' && dto.providers != '[]') {
        try {
          const pars = JSON.parse(dto.providers)
          if(pars && pars.length) {
            for(let prov of pars) {
              const provider = await this.providerService.getProviderById(prov.id)
              if(provider) inventary.$add('providers', prov.id)
            }
          }
        } catch (e) {
          console.error(e)
        }
      }

      if(dto.docs) {
        let docs: any = Object.values(JSON.parse(dto.docs))
        let i = 0
        for(let document of files.document) {
          let res = await this.documentsService.saveDocument(
            document, 
            'p', 
            docs[i].type,
            docs[i].version,
            docs[i].description,
            docs[i].name
          )
          if(res.id) {
            let docId = await this.documentsService.getFileById(res.id)
            await inventary.$add('documents', docId.id)
          }
          i++
        }
      }
      await inventary.save()
      return inventary
    }

    async deleteInventaryById(id: number) {
      const inventary =  await this.inventaryReprository.findByPk(id)
      if(!inventary)
        throw new HttpException('Запись не найден', HttpStatus.BAD_GATEWAY)
      
      inventary.ban = !inventary.ban
      await inventary.save()
      return inventary
    }

    async attachFileToInventary(inventary_id: number, file_id: number) {
      const inventary = await this.inventaryReprository.findByPk(inventary_id)
      const file = await this.documentsService.getFileById(file_id)

      if(inventary && file) 
          inventary.$add('documents', file.id)

      return file
    }
}