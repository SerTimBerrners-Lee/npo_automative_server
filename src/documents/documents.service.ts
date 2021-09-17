import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from './documents.model';
import CreateDocumentsDto from './dto/create-documents.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { ChangeTypeDto } from './dto/change-type.dto';

@Injectable()
export class DocumentsService {
    constructor(@InjectModel(Documents)
        private documentReprository: typeof Documents
    ) {}

    async createDocument(dto: CreateDocumentsDto) {
        return this.documentReprository.create(dto);
    }

    async createArrDocuments(arrFolder: [], files: any) {
        let ars = JSON.parse(Object.values(arrFolder)[0])
        files.document.forEach((doc, index) => {
                this.saveDocument(
                    doc, 
                    ars[index].nameInstans, 
                    ars[index].type,
                    ars[index].version,
                    ars[index].description,
                    ars[index].name
                )
        });
    }

    async saveDocument(file, nameInstans = '', type = '', version = '', description = '', name = '') {
        const imageTypes = ['bmp', 'gif', 'jpg', 'png', 'pds', 'tif', 'odg', 'jpeg', 'eps', 'pict', 'pcx', 'ico', 'svg', 'webp', 'avif']
        let folderToSave = 'doc';
        try {
            let origName: string;
            const fileType = file.originalname.split('.')[file.originalname.split('.').length - 1]
            name ? origName = name + '.' + fileType : origName = file.originalname
            for (let typ of imageTypes) {
                if (typ == fileType)
                    folderToSave = 'image'
            }
            
            const pathName = (origName + '__+__') + uuid.v4() +'.'+ fileType
            const filePath = path.resolve(__dirname, '..', `static/${folderToSave}`)
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath,  {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, pathName), file.buffer)

            const document = await this.createDocument({
                    name: origName, 
                    path: (folderToSave + '/' + pathName), 
                    nameInstans: nameInstans,
                    description: description,
                    version: version,
                    type: type
            })
            return document
        } catch(e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllDocument() {
        const docsD = this.documentReprository.findAll()
        return docsD
    } 

    async banFile(id: number) {
        const documents = await this.documentReprository.findByPk(id)
        if(!documents)
            throw new HttpException('Документ не найден', HttpStatus.NOT_FOUND)
        
        documents.banned = !documents.banned
        await documents.save()

        return documents
    }

    async changeType(dto: ChangeTypeDto) {
        const documents = await this.documentReprository.findByPk(dto.id)
        if(!documents)
            throw new HttpException('', HttpStatus.NOT_FOUND)

        documents.type = dto.type
        await documents.save()

        return documents
    }


}
