import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from './documents.model';
import CreateDocumentsDto from './dto/create-documents.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { ChangeTypeDto } from './dto/change-type.dto';
import { Detal } from 'src/detal/detal.model';
import { UpdateDocumentDto } from './dto/update-document.dto';
@Injectable()
export class DocumentsService {
    constructor(@InjectModel(Documents)
        private documentReprository: typeof Documents,
        @InjectModel(Detal) private detalReprository: typeof Detal,
    ) {}

    async createDocument(dto: CreateDocumentsDto) {
        return this.documentReprository.create(dto);
    }

    async createArrDocuments(arrFolder: [], files: any) {
        const NewArrsFile: Array<Documents> = []
        try {
            for(let inx in files.document) {
                const arr = JSON.parse(Object.values(arrFolder)[0])
                const result = await this.saveDocument(
                    files.document[inx],
                    arr[inx].nameInstans,
                    arr[inx].type,
                    arr[inx].version,
                    arr[inx].description,
                    arr[inx].name
                )
                if(result) NewArrsFile.push(result)
            }
            console.log(NewArrsFile)
            return NewArrsFile
        } catch(e) {
            throw new HttpException('', HttpStatus.BAD_GATEWAY)
        }
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

    async getFileById(id:number) {
        return await this.documentReprository.findByPk(id, {include: {all: true}})
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
    
    async setDetalForDocument(dto: any) {
        const detal = await this.detalReprository.findByPk(dto.id_detal)
        const document = await this.documentReprository.findByPk(dto.id_document)
        if(!detal || !document) 
            throw new HttpException('Не удалось найти деталь или документ', HttpStatus.BAD_REQUEST)
        await document.$add('detals', detal.id)
        await document.save()
        return document
    }

    async updateDocuments(dto: UpdateDocumentDto) {
        const document = await this.documentReprository.findByPk(dto.id)
        if(document) {
            if(dto.responsible_user_id)
                document.responsible_user_id = dto.responsible_user_id
            document.version = dto.version
            document.type = dto.type
            document.name = dto.name
            document.description = dto.description

            await document.save()
        }
        return document
    }

    async deleteDocument(id: number) {
        const document = await this.documentReprository.findByPk(id)
        if(!document)
            throw new HttpException('Документ не найден', HttpStatus.NOT_FOUND) 
    
        return await this.documentReprository.destroy({where: {id : document.id}})
    }

}
