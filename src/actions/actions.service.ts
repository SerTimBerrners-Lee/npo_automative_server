import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Actions } from './actions.model';

@Injectable()
export class ActionsService {
    constructor(@InjectModel(Actions) private actionsReprository: typeof Actions) {}

    async getAllActions() {
        return await this.actionsReprository.findAll({include: {all: true}})
    }


}
