
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { Assemble } from 'src/assemble/assemble.model';
import { Detal } from 'src/detal/detal.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { DocumentsService } from 'src/documents/documents.service';
import { RemoveDocumentDto } from 'src/files/dto/remove-document.dto';
import { Product } from 'src/product/product.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { Cbed } from './cbed.model';
import { CreateCbedDto } from './dto/create-cbed.dto';

@Injectable()
export class CbedService {
    constructor(@InjectModel(Cbed) private cbedReprository: typeof Cbed,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(TechProcess) private techProcessReprository: typeof TechProcess,
        @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
        @InjectModel(Detal) private detalReprository: typeof Detal,
        @InjectModel(Product) private productReprository: typeof Product,
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
        cbed.attention = dto.attention

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
            }
        }

        if(dto.materialList) {
            const mList = JSON.parse(dto.materialList)
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        mList[m].mat.name = material.name
                        await cbed.$add('materials', material.id)
                    }
                }
                cbed.materialList = JSON.stringify(mList)
            }
        } 

        cbed.listPokDet = ''

        if(dto.listPokDet) {
            const mList = JSON.parse(dto.listPokDet)
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        mList[m].mat.name = material.name
                        await cbed.$add('materials', material.id)
                    }
                }
                cbed.listPokDet = JSON.stringify(mList)
            }
        }

        cbed.listDetal = ''
        if(cbed.detals && cbed.detals.length) {
            for( let det of cbed.detals) {
                await cbed.$remove('detals', det.id) 
            }
        }
        
        if(dto.listDetal) {
            const mList = JSON.parse(dto.listDetal)
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let detal = await this.detalReprository.findByPk(mList[m].det.id)
                    if(detal) {
                        mList[m].det.name = detal.name
                        await cbed.$add('detals', detal.id)
                    }
                }
                cbed.listDetal = JSON.stringify(mList)
            }
        }

        if(cbed.listCbed) {
            try {
                const pars_list = JSON.parse(cbed.listCbed)
                for(let pl of pars_list) {
                    const check_cb = await this.cbedReprository.findByPk(pl.cb.id)
                    if(check_cb) {
                        const pars_parent = JSON.parse(check_cb.cbed)
                        let new_arr = []
                        for(let ppl of pars_parent) {
                            if(ppl.id == cbed.id) continue
                            new_arr.push(ppl)
                        }
                        check_cb.cbed = JSON.stringify(new_arr)
                    }
                }
            } catch(e) {console.error(e)}
        }

        if(dto.listCbed) {
            try {
                let mList = JSON.parse(dto.listCbed)
                if(mList) {
                    for(let m in mList) {
                        const check_cbed = await this.cbedReprository.findByPk(mList[m].cb.id)
                        if(check_cbed) {
                            mList[m].cb.name = check_cbed.name
                            let parent_list = JSON.parse(check_cbed.cbed)
                            let check = true
                            for(let pl of parent_list) {
                                if(pl.id == cbed.id) check = false
                            }
                            if(check) parent_list.push({id: cbed.id, name: cbed.name, articl: cbed.articl})
                            else check = true
                            check_cbed.cbed = JSON.stringify(parent_list)
                            await check_cbed.save()
                        }
                    }
                    cbed.listCbed = JSON.stringify(mList)
                }
            }catch(e) {console.error(e)}
        } else cbed.listCbed = ''

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
                console.error(e)
            }
        }

        if(dto.docs, files.document) 
            await this.documentsService.attachDocumentForObject(cbed, dto, files)

        await cbed.save()
        return cbed
    }

    async getAllCbed(light: string) {
        if(light == 'true') {
            const cbed = await this.cbedReprository.findAll({attributes: [
                'id', 'name', 'ban', 'articl', 'attention', 'createdAt', 'responsibleId'
            ]})
            return cbed
        }
        else {
            const cbed = await this.cbedReprository.findAll({include: {all: true}})
            return cbed
        }
    }

    async findById(id: number, light = 'false') {
        if(light == 'true') return await this.cbedReprository.findByPk(id, {
            include: ['shipments']
        })
        
        return await this.cbedReprository.findByPk(id, {include: [
            {all: true},
            {
                model: TechProcess,
                include: ['operations']
            }
        ]})
    }

    async getCbedByField(field: string, id: number) {
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

    async getOneCbedById(id: number, light: boolean = false) {
        if(light) return await this.cbedReprository.findByPk(id)
        
        return await this.cbedReprository.findByPk(id,  {include: [
            {all: true},
            {
            model: TechProcess,
            include: ['operations']
            }
        ]})
    }

    async removeDocumentCbed(dto: RemoveDocumentDto) {
        const cbed = await this.cbedReprository.findByPk(dto.id_object, {include: {all: true}})
        const document = await this.documentsService.getFileById(dto.id_document)

        if(cbed && document)
            cbed.$remove('documents', document.id)
        return cbed
    }

    async attachFileToCbed(cbed_id: number, file_id: number) {
        const cbed = await this.cbedReprository.findByPk(cbed_id)
        const file = await this.documentsService.getFileById(file_id)

        if(cbed && file) 
            cbed.$add('documents', file.id)

        return file
    }

    async getCbedIncludeOperation() {
        const cbed = await this.cbedReprository.findAll({include: [{
            model: TechProcess, 
            include: [{all: true}]
        }]})
        
        let new_arr = []
        for(let cb of cbed) {
            if(!cb.techProcesses || cb.techProcesses.operations.length == 0) new_arr.push(cb.id)
        }

        return new_arr
    }
}
 