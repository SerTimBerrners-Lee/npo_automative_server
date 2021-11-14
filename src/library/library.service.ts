import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { Chapter } from './chapter.model';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { Links } from './links.model';

@Injectable()
export class LibraryService {
  constructor(
		@InjectModel(Chapter) private chapterReprository: typeof Chapter,
    @InjectModel(Links) private linksReprository: typeof Links,
    private documentsService: DocumentsService
    ) {}

    async createNewChapter(dto: CreateChapterDto) {
      return await this.chapterReprository.create({name: dto.name})
    }

    async updateChapter(dto: CreateChapterDto) {
      const chapter = await this.chapterReprository.findByPk(dto.id)
      if(chapter) {
        chapter.name = dto.name
        await chapter.save()
      }
      return chapter
    }

    async getAllChapter() {
      const chapters = await this.chapterReprository.findAll({include: [
        {all:true}, {
          model: Links, 
          include: [{all: true}]
        }
      ]})
      return chapters
    }

    async deleteChapterById(id: number) {
      const chapter = await this.chapterReprository.findByPk(id)
      if(chapter) 
        return await this.chapterReprository.destroy({where: {id: chapter.id}})
    }

    async createNewLinks(dto: CreateLinkDto, files: any) {
      const links = await this.linksReprository.create({name: dto.name})
      if(!links)
        throw new HttpException('Не удалось создать линк', HttpStatus.BAD_GATEWAY)

      if(dto.description != 'null') links.description = dto.description
      else links.description = ''
      if(dto.link != 'null') links.link = dto.link
      else links.link = ''
      
      const user = await this.linksReprository.findByPk(dto.user_id)
      if(user) 
        links.responsible_id = user.id
      if(dto.chapter_id) {
        const chapter = await this.chapterReprository.findByPk(dto.chapter_id)
        if(chapter) 
          links.chapter_id = chapter.id
      }

      try {
        const is_link = JSON.parse(dto.is_link)
        links.is_link = is_link
      } catch(e) {
        console.error(e)
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
            let docId = await this.documentsService.getFileById(res.id)
            await links.$add('documents', docId.id)
            await links.save()
          }
          i++
        }
      }


      await links.save()
      const all_folter_links = await this.linksReprository.findByPk(links.id, {include: {all: true}})
      return all_folter_links
    }

    async getALlLinks() {
      return await this.linksReprository.findAll({include: {all: true}})
    }

    async toBanLinks(id: number) {
      const link = await this.linksReprository.findByPk(id)
      if(link) {
        link.ban = !link.ban
        await link.save()
        return link
      }
    }

}