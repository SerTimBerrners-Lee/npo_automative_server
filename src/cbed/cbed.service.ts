
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { all } from 'sequelize/types/lib/operators';
import { Detal } from 'src/detal/detal.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { Cbed } from './cbed.model';
import { CreateCbedDto } from './dto/create-cbed.dto';

@Injectable()
export class CbedService {
    constructor(@InjectModel(Cbed) private cbedReprository: typeof Cbed,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(TechProcess) private techProcessReprository: typeof TechProcess,
        @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
        @InjectModel(Detal) private detalReprository: typeof Detal,
        private documentsService: DocumentsService) {}


    async createNewCbed(dto: CreateCbedDto, files: any) {
        const create_cbed = await this.cbedReprository.create({name: dto.name})
        if(!create_cbed)
            throw new HttpException('Не удалось создать сборочную единицу', HttpStatus.BAD_REQUEST)
        const cbed = await this.cbedReprository.findByPk(create_cbed.id)

        return await this.upCreateCbed(dto, files, cbed)
    }

    async updateCbed(dto: CreateCbedDto, files: any) {
        if(!Number(dto.id))
            throw new HttpException('Запись не найдена', HttpStatus.BAD_REQUEST)
        const cbed = await this.cbedReprository.findByPk(dto.id, {include: {all: true}})
        if(!cbed)
            throw new HttpException('Запись не найдена', HttpStatus.BAD_REQUEST)
        cbed.name = dto.name
        await cbed.save() 

        return this.upCreateCbed(dto, files, cbed)
    }

    async getAllCbedArticl() {
        return await this.cbedReprository.findAll({attributes: ['articl']})
    }

    private async upCreateCbed(dto: any, files: any, cbed: Cbed) {
        cbed.articl = dto.articl
        if(dto.description != 'null')
            cbed.description = dto.description
        else 
            cbed.description = ''
        if(dto.parametrs)
            cbed.parametrs = dto.parametrs
        if(dto.haracteriatic)
            cbed.haracteriatic = dto.haracteriatic

        if(Number(dto.responsible)) {
            const user = await this.userRepository.findByPk(dto.responsible)
            if(user)
                cbed.responsibleId = user.id
        }
        await cbed.save()

        if(Number(dto.techProcessID)) {
            const tp = await this.techProcessReprository.findByPk(dto.techProcessID)
            if(tp) {
                tp.cbedId = cbed.id
                await tp.save() 
            }
        }

        await cbed.save()

        cbed.materialList = ''
        
        if(cbed.materials && cbed.materials.length) {
            for( let mat of cbed.materials) {
                await cbed.$remove('materials', mat.id)
                await cbed.save()
            }
        }

        if(dto.materialList) {
            const mList = JSON.parse(dto.materialList)
            cbed.materialList = dto.materialList
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        await cbed.$add('materials', material.id)
                        await cbed.save()
                    }
                }
            }
        } 

        cbed.listPokDet = ''

        if(dto.listPokDet) {
            const mList = JSON.parse(dto.listPokDet)
            cbed.listPokDet = dto.listPokDet
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        await cbed.$add('materials', material.id)
                        await cbed.save()
                    }
                }
            }
        }

        cbed.listDetal = ''
        if(cbed.detals && cbed.detals.length) {
            for( let det of cbed.detals) {
                await cbed.$remove('detals', det.id) 
                await cbed.save()
            }
        }
        
        if(dto.listDetal) {
            const mList = JSON.parse(dto.listDetal)
            cbed.listDetal = dto.listDetal
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let detal = await this.detalReprository.findByPk(mList[m].det.id)
                    if(detal) {
                        await cbed.$add('detals', detal.id)
                        await cbed.save()
                    }
                }
            }
        }
        if(dto.listCbed) 
            cbed.listCbed = dto.listCbed
        else cbed.listCbed = ''

        if(cbed.documents) {
            for(let doc of cbed.documents) {
                cbed.$remove('documents', doc.id)
            }
        }
        
        if(dto.file_base && dto.file_base != '[]') {
            try {
                let pars = JSON.parse(dto.file_base)
                for(let file of pars) {
                    const check_files = await this.documentsService.getFileById(file)
                    if(check_files)
                        await cbed.$add('documents', check_files)
                }
            }   catch(e) {
                console.log(e)
            }
        }

        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentsService.saveDocument(
                    document, 
                    'p', 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res && res.id) {
                    const docId = await this.documentsReprository.findByPk(res.id)
                    if(docId) await cbed.$add('documents', docId.id)
                }
                i++
            }
        }

        await cbed.save()
        return cbed
    }

    async getAllCbed() {
        const cbed = await this.cbedReprository.findAll({include: {all: true}})
        return cbed
    }

    async findById(id: number) {
        return await this.cbedReprository.findByPk(id, {include: {all: true}})
    }

    async getCbedByField(field: string, id: number) {
        console.log(field, id)
        try {
            const result = await this.cbedReprository.findByPk(id, {include: [field], attributes: ['id']})
            return result
        } catch (e) {
            console.error(e)
            return false
        }
    }

    async banCbed(id: number) {
        const cbed = await this.cbedReprository.findByPk(id)
        if(cbed) {
            cbed.ban = !cbed.ban
            await cbed.save()
            return cbed
        }
    }

    async getOneCbedById(id: number) {
        return await this.cbedReprository.findByPk(id, {include: {all: true}})
    }

    async removeDocumentCbed(dto: RemoveDocumentDto) {
        const cbed = await this.cbedReprository.findByPk(dto.id_object, {include: {all: true}})
        const document = await this.documentsService.getFileById(dto.id_document)

        if(cbed && document) {
            cbed.$remove('documents', document.id)
            await cbed.save()
        }
        return cbed
    }

    async getAllDeficitCbed() {
		const cbeds = await this.cbedReprository.findAll({include: {all: true}, where: {
            shipments_kolvo: {
                [Op.gt]: 0
            }
        }})

        return cbeds
	}

    async attachFileToCbed(cbed_id: number, file_id: number) {
        const cbed = await this.cbedReprository.findByPk(cbed_id)
        const file = await this.documentsService.getFileById(file_id)

        if(cbed && file) 
            cbed.$add('documents', file.id)

        return file
    }
}
 