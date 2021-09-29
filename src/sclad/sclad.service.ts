import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Deficit } from './deficit.model';
import { UpdateDeficitDto } from './dto/create-deficite.dto';

@Injectable()
export class ScladService {
    constructor(@InjectModel(Deficit) private deficitReprository: typeof Deficit) {}

    async updateDeficit(dto: UpdateDeficitDto) {
        const deficit = await this.deficitReprository.update(
            {
                minRemainder: dto.minRemainder, 
                recommendedRemainder: dto.recommendedRemainder
            }, 
            {
                where: {id: dto.id}
            })
                
        if(!deficit)
            throw new HttpException('Не удалось обновить таблицу дефицита', HttpStatus.BAD_REQUEST)
        return deficit;
    }

    async getDeficit() {
        return await this.deficitReprository.findAll({include: {all: true}})
    }
}
