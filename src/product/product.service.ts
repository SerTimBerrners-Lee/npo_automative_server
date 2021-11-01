import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cbed } from 'src/cbed/cbed.model';
import { Detal } from 'src/detal/detal.model';
import { TechProcess } from 'src/detal/tech-process.model';
import { Documents } from 'src/documents/documents.model';
import { DocumentsService } from 'src/documents/documents.service';
import { PodPodMaterial } from 'src/settings/pod-pod-material.model';
import { User } from 'src/users/users.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Cbed) private cbedReprository: typeof Cbed,
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Documents) private documentsReprository: typeof Documents,
        @InjectModel(TechProcess) private techProcessReprository: typeof TechProcess,
        @InjectModel(PodPodMaterial) private podPodMaterialReprository: typeof PodPodMaterial,
        @InjectModel(Detal) private detalReprository: typeof Detal,
        @InjectModel(Product) private productReprository: typeof Product,
        private documentsService: DocumentsService) {}


    async createNewProduct(dto: CreateProductDto, files: any) {
        const product = await this.productReprository.create({name: dto.name})
        if(!product)
            throw new HttpException('Не удалось создать сборочную единицу', HttpStatus.BAD_REQUEST)

        return await this.upCreateProduct(dto, files, product)
    }

    async updateProduct(dto: CreateProductDto, files: any) {
        if(!Number(dto.id)) 
            throw new HttpException('Не найден', HttpStatus.BAD_REQUEST)

        const product = await this.productReprository.findByPk(dto.id, {include: {all: true}})
        if(!product) 
            throw new HttpException('Изделие не найдено', HttpStatus.BAD_REQUEST)

        product.name = dto.name
        await product.save()
        return await this.upCreateProduct(dto, files, product)
    }

    private async upCreateProduct(dto: CreateProductDto, files: any, product: Product) {
        product.articl = dto.articl
        product.fabricNumber = dto.fabricNumber
        if(dto.description != 'null')
            product.description = dto.description
        else 
            product.description = ''
        if(dto.parametrs)
            product.parametrs = dto.parametrs
        if(dto.haracteriatic)
            product.haracteriatic = dto.haracteriatic

        if(Number(dto.responsible)) {
            const user = await this.userRepository.findByPk(dto.responsible)
            if(user)
                product.responsibleId = user.id
        }
        await product.save()

        if(Number(dto.techProcessID)) {
            const tp = await this.techProcessReprository.findByPk(dto.techProcessID)
            if(tp) {
               tp.productId = product.id
                await tp.save()
            }
        }

        await product.save()

        product.materialList = ''
        if(product.materials && product.materials.length) {
            for( let mat of product.materials) {
                await product.$remove('materials', mat.id) 
                await product.save()
            }
        }

        if(dto.materialList) {
            const mList = JSON.parse(dto.materialList)
            product.materialList = dto.materialList
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        await product.$add('materials', material.id)
                        await product.save()
                    }
                }
            }
        }

        product.listPokDet = ''

        if(dto.listPokDet) {
            const mList = JSON.parse(dto.listPokDet)
            product.listPokDet = dto.listPokDet
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let material = await this.podPodMaterialReprository.findByPk(mList[m].mat.id)
                    if(material) {
                        await product.$add('materials', material.id)
                        await product.save()
                    }
                }
            }
        }

        product.listDetal = ''
        if(product.detals && product.detals.length) {
            for( let det of product.detals) {
                await product.$remove('detals', det.id) 
                await product.save()
            }
        }

        if(dto.listDetal) {
            const mList = JSON.parse(dto.listDetal)
            product.listDetal = dto.listDetal
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let detal = await this.detalReprository.findByPk(mList[m].det.id)
                    if(detal) {
                        await product.$add('detals', detal.id)
                        await product.save()
                    }
                }
            }
        }

        product.listCbed = ''
        if(product.cbeds && product.cbeds.length) {
            for( let cb of product.cbeds) {
                await product.$remove('cbeds', cb.id) 
                await product.save()
            }
        }

        if(dto.listCbed) {
            const mList = JSON.parse(dto.listCbed)
            product.listCbed = dto.listCbed
            if(mList.length) {
                for(let m = 0; m < mList.length; m++) {
                    let cbed = await this.cbedReprository.findByPk(mList[m].cb.id)
                    if(cbed) {
                        await product.$add('cbeds', cbed.id)
                        await product.save()
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
                    'p', 
                    docs[i].type,
                    docs[i].version,
                    docs[i].description,
                    docs[i].name
                )
                if(res.id) {
                    let docId = await this.documentsReprository.findByPk(res.id)
                    await product.$add('documents', docId.id)
                    await product.save()
                }
                i++
            }
        }


        return product
    }

    async getAllProduct() {
        const product = await this.productReprository.findAll({include: {all: true}})
        return product
    }

    async getById(id: number) {
        return await this.productReprository.findByPk(id)
    }

    async banProduct(id: number) {
        const product = await this.productReprository.findByPk(id)
        if(product) {
            product.ban = !product.ban
            await product.save()

            return product
        }
    }

    async getProductByIdLight(id: number) {
        return await this.productReprository.findByPk(id)
    }
}
