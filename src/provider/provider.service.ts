import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Providers } from './provider.model';

@Injectable()
export class ProviderService {
    constructor(@InjectModel(Providers) private providersReprository: typeof Providers,
            @InjectModel(Documents) private documentsReprository: typeof Documents,
            @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
            private documentService: DocumentsService
    ) {}

    async createProvider(dto: CreateProviderDto, files: any) {
        let providers: any
        if(Number(dto.id)) {
            providers = await this.providersReprository.findByPk(Number(dto.id))
        } else {
            providers = await this.providersReprository.create({ name: dto.name})
        }
        if(!providers)
            throw new HttpException('Произошла ошибка при добавлении пользователя', HttpStatus.NOT_FOUND)
            
        providers.name = dto.name
        
        if(dto.rekvisit != 'null') 
            providers.rekvisit = dto.rekvisit
        else
            providers.rekvisit =''
        if(dto.contacts != 'null') 
            providers.contacts = dto.contacts
        else
            providers.contacts =''
        if(dto.inn != 'null') 
            providers.inn = dto.inn
        else
            providers.inn =''
        if(dto.cpp != 'null') 
            providers.cpp = dto.cpp 
        else
            providers.cpp =''
        if(dto.description != 'null') 
            providers.description = dto.description 
        else
            providers.description =''
        await providers.save()
        
        if(dto.docs) {
            let docs: any = Object.values(JSON.parse(dto.docs))
            let i = 0
            for(let document of files.document) {
                let res = await this.documentService.saveDocument(
                    document, 
                    docs[i].nameInstans, 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await providers.$add('documents', docId.id)
                }
                i++
            }
        }
        
        if(dto.materialList) {
            let mat = JSON.parse(dto.materialList)
            if(mat.length) {
                for(let m of mat) {
                    let check = await this.podPodMaterialReprository.findByPk(m)
                    if(check) 
                        await providers.$add('materials', check.id)
                }
            }
        }

        await providers.save()

        return providers
    
    }

    async getProviders() {
        const providers = await this.providersReprository.findAll({include: {all: true}})
        if(providers)
            return providers
    }

    async banProvider(id: number) {
        const provider = await this.providersReprository.findByPk(id)
        if(provider) {
            provider.ban = !provider.ban
            await provider.save()
            return provider
        }
    }
}
