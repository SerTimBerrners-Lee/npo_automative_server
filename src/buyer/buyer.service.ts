import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { Buyer } from './buyer.model';
import { CreateBuyerDto } from './dto/create-buyer.dto';

@Injectable()
export class BuyerService {
    constructor(@InjectModel(Buyer) private buyerReprository: typeof Buyer,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        private documentService: DocumentsService
    ) {}

    async createBuyer(dto: CreateBuyerDto, files: any) {
        let buyer: any
        if(Number(dto.id)) {
            buyer = await this.buyerReprository.findByPk(Number(dto.id))
        } else {
            buyer = await this.buyerReprository.create({ name: dto.name})
        }
        if(!buyer)
            throw new HttpException('Произошла ошибка при добавлении пользователя', HttpStatus.NOT_FOUND)

        buyer.name = dto.name

        console.log(dto)

        if(dto.rekvisit != 'null') 
            buyer.rekvisit = dto.rekvisit
        else
            buyer.rekvisit = ''
        if(dto.contacts != 'null') 
            buyer.contacts = dto.contacts
        else
            buyer.contacts =''
        if(dto.inn != 'null') 
            buyer.inn = dto.inn
        else
            buyer.inn =''
        if(dto.cpp != 'null') 
            buyer.cpp = dto.cpp 
        else
            buyer.cpp =''
        if(dto.description != 'null') 
            buyer.description = dto.description 
        else
            buyer.description =''
        await buyer.save()
        
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
                    await buyer.$add('documents', docId.id)
                }
                i++
            }
        }

        await buyer.save()

        return buyer
    }

    async getBuyers() {
        const buyers = await this.buyerReprository.findAll({include: {all: true}})
        return buyers
    }

    async ban(id: number) {
        const buyer = await this.buyerReprository.findByPk(id)
        if(buyer) {
            buyer.ban = !buyer.ban
            await buyer.save()
            return buyer
        }
    }
}
 