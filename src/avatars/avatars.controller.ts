import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarsService } from './avatars.service';
import { CreateAvatarsDto } from './dto/create-avatar.dto';

@Controller('avatars')
export class AvatarsController {

    constructor(private avatarService: AvatarsService) {}

}
