import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { Detal } from 'src/detal/detal.model';
import { Documents } from './documents.model';
import { InjectModel } from '@nestjs/sequelize';
import { ChangeTypeDto } from './dto/change-type.dto';
import CreateDocumentsDto from './dto/create-documents.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateMethods } from 'src/files/date.methods';
@Injectable()
export class DocumentsService {
    constructor(@InjectModel(Documents)
        private documentReprository: typeof Documents,
        @InjectModel(Detal) private detalReprository: typeof Detal,
    ) {}

    async createDocument(dto: CreateDocumentsDto) {
        return this.documentReprository.create(dto);
    }

    async createArrDocuments(dto: any, files: any) {
        if(!dto.docs || !files || !files.document || !files.document.length) return false

        const NewArrsFile: Array<Documents> = [];
        try {
            for(let inx in files.document) {
                const docs = Object.values(JSON.parse(dto.docs))
                const result = await this.saveDocument(
                    files.document[inx],
                    docs[inx].nameInstans,
                    docs[inx].type,
                    docs[inx].version,
                    docs[inx].description,
                    docs[inx].name,
                    docs[inx].newVersion,
                    docs[inx].ava
                )
                if(!result) continue;
                if(result) NewArrsFile.push(result);
            }
            return NewArrsFile;
        } catch(e) {
            throw new HttpException('Не удалось создать файлы', HttpStatus.BAD_GATEWAY)
        }
    }

    /**
     * Обрабатываем документ добавляем если его нет 
     * @param obj 
     * @param dto 
     * @param files 
     */
    async attachDocumentForObject(obj: any, dto: any, files: any) {
        const arrDocuments = await this.createArrDocuments(dto, files);
        if (arrDocuments && arrDocuments.length) {
            const obj_documents = await obj.$get('documents');
            for (const doc of arrDocuments) {
                let check = true;
                if (obj_documents && obj_documents.length) {
                    for(const have_doc of obj_documents) {
                        if (doc && have_doc.id == doc.id) check = false;
                    }
                }
                if (doc && doc.id && check) await obj.$add('documents', doc.id);
                else check = true;
            }
        }
    }

    /**
     * Находим аватар и возвращаем
     * Если не находим - находим png и делаем его аватаром
     * @param documents 
     * @returns path
     */
    async returnIncludeAva(documents: Array<Documents>): Promise<string> {
        if (!documents || !documents.length) return '';
        let find = '';
        let ava: Documents = null;
        // let ava_two: Documents = null;

        for (const item of documents) {
            if (item.ava) find = item.path;
            if (item.path && this.typeFile(item.path).toLocaleLowerCase() == 'png') {
                ava = item;
            }
            // if (item.path && this.typeFile(item.path).toLocaleLowerCase() == 'jpg') {
            //     ava_two = item;
            // }
        }
        if (!find && ava) {
            ava.ava = true;
            find = ava.path;
            await ava.save();
        }
        // if (!find && !ava && ava_two) {
        //     ava_two.ava = true;
        //     find = ava_two.path;
        //     await ava_two.save();
        // }
        return find;
    }

    typeFile(str: string): string {
        return str.split('.')[str.split('.').length - 1];
    }

    /**
     * 
     * @param obj 
     * @param json_id: '[{34}, {1}, {32}]' 
     */
    async attachDocumentFrorObjectJSON(obj: any, json_id: string) {
        try {
            if(!json_id || json_id == '[]' || json_id == '' || !obj) return false;
            const pars = JSON.parse(json_id);
            for(const item of pars) {
                const file = await this.getFileById(item, true);
                if(file) await obj.$add('documents', file.id);
            }
        } catch(err) {console.error(err)}
    }

    async saveDocument(file: any, nameInstans = '', type = '', version = 1, description = '', name = '', newVersion = false, ava = false) {
        const imageTypes = ['bmp', 'gif', 'jpg', 'png', 'pds', 'tif', 'odg', 'jpeg', 'eps', 'pict', 'pcx', 'ico', 'svg', 'webp', 'avif']
        let folderToSave = 'doc';
        try {
            let origName: string;
            const fileType = this.typeFile(file.originalname);
            name ? origName = name + '.' + fileType : origName = file.originalname;
            for (const typ of imageTypes) 
                if (typ == fileType) folderToSave = 'image'
            
            const pathName = (origName + '__+__') + uuid.v4() +'.'+ fileType;
            const filePath = path.resolve(__dirname, '..', `static/${folderToSave}`)
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath,  {recursive: true})
            }
            const findDocuments: Documents = await this.documentReprository.findOne({where: {name: file.originalname}, include: {all: true}})
            if(newVersion && findDocuments) {
                findDocuments.banned = true
                findDocuments.name =  findDocuments.name + '_archive_v' + String(findDocuments.version)
                await findDocuments.save()
                version = Number(findDocuments.version) + 1
            } else if(!newVersion && findDocuments) return false
            
            fs.writeFileSync(path.join(filePath, pathName), file.buffer)

            const document = await this.createDocument({
                name: origName,  
                path: (folderToSave + '/' + pathName), 
                nameInstans, description, version, type, ava
            })

            if(newVersion && findDocuments) 
                await this.reBindingDocuments(findDocuments, document)
            
            return document
        } catch(e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createZipper(buffer: any, type: string = 'zip') {
        try {
            const pathName = (new DateMethods().date + '__+__') + uuid.v4() +'.'+ type;
            const filePath = path.resolve(__dirname, '..', `static/${'zip'}`);
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath,  {recursive: true});
            }
    
            fs.writeFileSync(path.join(filePath, pathName), buffer);

            return true;
        } catch (e) {
            return e;
        }
    }

    private async reBindingDocuments(lastDocument: Documents, newDocument: Documents) {
        if(lastDocument.materials.length) {
            for(let izdels of lastDocument.materials) {
                newDocument.$add('materials', izdels.id)
            }
        }
        if(lastDocument.cbeds.length) {
            for(let izdels of lastDocument.cbeds) {
                newDocument.$add('cbeds', izdels.id)
            }
        }
        if(lastDocument.detals.length) {
            for(let izdels of lastDocument.detals) {
                newDocument.$add('detals', izdels.id)
            }
        }
        if(lastDocument.providers.length) {
            for(let izdels of lastDocument.providers) {
                newDocument.$add('providers', izdels.id)
            }
        }
        if(lastDocument.instrument.length) {
            for(let izdels of lastDocument.instrument) {
                newDocument.$add('instrument', izdels.id)
            }
        }
        if(lastDocument.inventary.length) {
            for(let izdels of lastDocument.inventary) {
                newDocument.$add('inventary', izdels.id)
            }
        }
        if(lastDocument.equipments.length) {
            for(let izdels of lastDocument.equipments) {
                newDocument.$add('equipments', izdels.id)
            }
        }
        if(lastDocument.products.length) {
            for(let izdels of lastDocument.products) {
                newDocument.$add('products', izdels.id)
            }
        }
        if(lastDocument.buyers.length) {
            for(let izdels of lastDocument.buyers) {
                newDocument.$add('buyers', izdels.id)
            }
        }
        if(lastDocument.users.length) {
            for(let izdels of lastDocument.users) {
                newDocument.$add('users', izdels.id)
            }
        }
        if(lastDocument.shipments.length) {
            for(let izdels of lastDocument.shipments) {
                newDocument.$add('shipments', izdels.id)
            }
        }
        if(lastDocument.issues.length) {
            for(let izdels of lastDocument.issues) {
                newDocument.$add('issues', izdels.id)
            }
        }
    }

    // Меняем файлу значение аватарки (в слайде такой файл будет выводиться на первое место)
    async avatarChangeBoolean(id: number) {
        const file = await this.documentReprository.findByPk(id);
        if (!file) throw new HttpException('Не удалось найти файл', HttpStatus.BAD_GATEWAY);
        
        file.ava = !file.ava;
        await file.save();
        console.log(file.toJSON());
        
        return file;
    }

    async getAllDocument() {
        const docsD = await this.documentReprository.findAll({where: {banned: false}})
        return docsD
    }

    async getAllDocumentsArchive() {
        const docs = await this.documentReprository.findAll({
            attributes: ['id', 'name', 'updatedAt', 'type', 'description', 'banned'],
            where: {banned: true}
        });
        if (!docs) throw new HttpException('Не удалось получить документы в архиве', HttpStatus.BAD_GATEWAY);

        return docs;
    }

    async getAllBanDocuments(length: number) {
        const query = {where: {banned: true}}
        const count = await this.documentReprository.count(query)
        if(count == length) return count;
         
        const docs = await this.documentReprository.findAll(query)
        return docs
    }

    async getAllNamesDocuments() {
        return await this.documentReprository.findAll({attributes: ['name']})
    }

    async getFileById(id: number, light: any = false) {
        if(!light || light == 'false') {
            return await this.documentReprository.findByPk(id, {
                include: { all: true }
            });
        }

        return await this.documentReprository.findByPk(id);
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
        const documents = await this.documentReprository.findByPk(dto.id, {attributes: ['id', 'type']})
        if(!documents)
            throw new HttpException('Документ не найден', HttpStatus.NOT_FOUND)

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
