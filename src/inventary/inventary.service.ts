import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PTInventary } from './inventary-pt.model';
import { PInventary } from './inventary-type.model';

@Injectable()
export class InventaryService {
  constructor(
    @InjectModel(PInventary) private pInventaryReprository: typeof PInventary,
    @InjectModel(PTInventary) private ptInventaryReprository: typeof PTInventary, 
    ) {}

    async createPInventary(dto: any) {
      const inventary = await this.pInventaryReprository.create(dto)
      if(!inventary)
        throw new HttpException('Не удалось создать подтип', HttpStatus.BAD_GATEWAY)
      return inventary
    }

    async updatePInventary(dto: any) {
      const inventary = await this.pInventaryReprository.findByPk(dto.id)
      if(!inventary)
        throw new HttpException('Не удалось создать подтип', HttpStatus.BAD_GATEWAY)
      inventary.name = dto.name
      await inventary.save()
      return inventary
    }

    async getAllPInventary() {
      return await this.pInventaryReprository.findAll()
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
      return await this.ptInventaryReprository.findAll()
    }

    async deletePTInventary(id: number) {
      const inventary = await this.ptInventaryReprository.findByPk(id)
      if(inventary)
        return await this.ptInventaryReprository.destroy({where: {id}})
    }
}