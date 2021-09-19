import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { isArray } from 'lodash';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Equipment } from 'src/equipment/equipment.model';
import { NameInstrument } from 'src/instrument/name-instrument.model';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { Detal } from './detal.model';
import { CreateDetalDto } from './dto/create-detal.dto';
import { CreateOperationDto } from './dto/create-operation.dto';
import { Operation } from './operation.model';

@Injectable()
export class DetalService {
    constructor(@InjectModel(Detal) private detalReprository: typeof Detal,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
        @InjectModel(Operation) private operationReprository: typeof Operation,
        @InjectModel(NameInstrument) private nInstrumentReprository: typeof NameInstrument,
        @InjectModel(Equipment) private equipmentReprository: typeof Equipment,
        private documentsService: DocumentsService
    ) {}

    async createNewDetal(dto: CreateDetalDto, files: any) {
        const detal = await this.detalReprository.create({name: dto.name})
        if(!detal)
            throw new HttpException('Не удалось создать деталь', HttpStatus.BAD_REQUEST)

        console.log(dto)
        detal.atricl = dto.atricl
        detal.responsible = dto.responsible
        detal.description = dto.description
        detal.parametrs = dto.parametrs
        detal.haracteriatic = dto.haracteriatic
        detal.DxL = dto.DxL
        detal.massZag = dto.massZag
        detal.trash = dto.trash

        await detal.save()

        if(Number(dto.mat_zag)) {
            detal.mat_zag = dto.mat_zag
            let material = await this.podPodMaterialReprository.findByPk(dto.mat_zag)
            if(material) {
                await detal.$add('materials', material.id)
                detal.mat_zag = dto.mat_zag
                await detal.save()
            }
        }
        if(Number(dto.mat_zag_zam)) {
            detal.mat_zag_zam = dto.mat_zag_zam
            let material = await this.podPodMaterialReprository.findByPk(dto.mat_zag_zam)
            if(material) {
                await detal.$add('materials', material.id)
                detal.mat_zag_zam = dto.mat_zag_zam
                await detal.save()
            }
        }

        if(dto.materialList) {
            const mList = JSON.parse(dto.materialList)
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        await detal.$add('materials', material.id)
                        await detal.save()
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
                    await detal.$add('documents', docId.id)
                }
                i++
            }
        }

        return detal
    }

    async createNewOperation(dto: CreateOperationDto, files: any) {
        const operation = await this.operationReprository.create({name: dto.name})
        if(!operation)
            throw new HttpException('Не удалось создать операцию', HttpStatus.BAD_REQUEST)
        
        if(dto.description)
            operation.description = dto.description
        if(dto.preTime)
            operation.preTime = dto.preTime
        if(dto.helperTime)
            operation.helperTime = dto.helperTime
        if(dto.mainTime)
            operation.mainTime = dto.mainTime
        if(dto.generalCountTime)
            operation.generalCountTime = dto.generalCountTime

        let instL: any;
        if(dto.instrumentList) { 
            instL = JSON.parse(dto.instrumentList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let instruments = await this.nInstrumentReprository.findByPk(instL[i].id)
                    if(instruments) {
                        await operation.$add('instruments', instruments.id)
                        await operation.save()
                    }
                }
                operation.instrumentList = dto.instrumentList
            }
        }

        if(dto.instrumentMerList) {
            instL = JSON.parse(dto.instrumentMerList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let instruments = await this.nInstrumentReprository.findByPk(instL[i].id)
                    if(instruments) {
                        await operation.$add('instruments', instruments.id)
                        await operation.save()
                    }
                }
                operation.instrumentMerList = dto.instrumentMerList
            }
        }

        if(dto.instrumentOsnList) {
            instL = JSON.parse(dto.instrumentOsnList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let instruments = await this.nInstrumentReprository.findByPk(instL[i].id)
                    if(instruments) {
                        await operation.$add('instruments', instruments.id)
                        await operation.save()
                    }
                }
                operation.instrumentOsnList = dto.instrumentOsnList
            }
        }

        if(dto.eqList) {
            instL = JSON.parse(dto.eqList)
            if(isArray(instL) && instL.length) {
                for(let i = 0; i < instL.length; i++) {
                    let eq = await this.equipmentReprository.findByPk(instL[i].id)
                    if(eq) {
                        await operation.$add('equipments', eq.id)
                        await operation.save()
                    }
                }
                operation.eqList = dto.eqList
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
                    await operation.$add('documents', docId.id)
                }
                i++
            }
        }

        await operation.save()
        return operation
    }
}
