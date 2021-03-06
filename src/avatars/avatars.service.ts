import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { Avatars } from './avatars.model';
import { CreateAvatarsDto } from './dto/create-avatar.dto';

@Injectable()
export class AvatarsService {

    constructor(@InjectModel(Avatars) private avatarReprository: typeof Avatars,
                private fileService: FilesService) {}


}
