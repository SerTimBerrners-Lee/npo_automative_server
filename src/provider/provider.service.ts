import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Providers } from './provider.model';

@Injectable()
export class ProviderService {
    constructor(@InjectModel(Providers) private providersReprository: typeof Providers,
            @InjectModel(Documents) private documentsReprository: typeof Documents,
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

        console.log(dto)
        console.log(providers)

        if(dto.name)
            providers.name = dto.name
        
        if(dto.rekvisit) 
            providers.rekvisit = dto.rekvisit
        
        if(dto.contacts) 
            providers.contacts = dto.contacts

        if(dto.inn) 
            providers.inn = dto.inn
        
        if(dto.cpp) 
            providers.cpp = dto.cpp 

        if(dto.description) 
            providers.description = dto.description 
        
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
