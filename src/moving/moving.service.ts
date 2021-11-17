import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMovingDto } from './dto/create-moving.dto';
import { Moving } from './moving.model';

@Injectable()
export class MovingService {
  constructor(
    @InjectModel(Moving) private movingReprository: typeof Moving
  ) {}

  async createNewMoving(dto: CreateMovingDto, files: any) {
    console.log(dto, files)
  }

  async getAllMoving() {
    return await this.movingReprository.findAll({include: {all: true}})
  }
}
