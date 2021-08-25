import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {

    async createFile(file): Promise<string> {
        try{
            let imgType = (file.originalname.split('.')[file.originalname.split('.').length - 1])
            const fileName = uuid.v4() + imgType;
            const filePath = path.resolve(__dirname, '..', 'static')
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath,  {recursive: true})
            }

            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName;
        } catch(e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
