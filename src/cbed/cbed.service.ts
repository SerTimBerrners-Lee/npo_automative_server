
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Detal } from 'src/detal/detal.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
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
        const cbed = await this.cbedReprository.create({name: dto.name})
        if(!cbed)
            throw new HttpException('Не удалось создать сборочную единицу', HttpStatus.BAD_REQUEST)

        return await this.upCreateCbed(dto, files, cbed)
    }

    private async upCreateCbed(dto: any, files: any, cbed: Cbed) {
        console.log(dto)
        console.log(files)
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
                await cbed.$add('techProcesses', tp.id)
                await cbed.save()
            }
        }

        await cbed.save()

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

        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentsService.saveDocument(
                    document, 
                    docs[i].nameInstans, 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await cbed.$add('documents', docId.id)
                    await cbed.save()
                }
                i++
            }
        }


        return cbed
    }

    async getAllCbed() {
        const cbed = await this.cbedReprository.findAll({include: {all: true}})
        return cbed
    }
}
 