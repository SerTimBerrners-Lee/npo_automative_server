import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { UsersService } from 'src/users/users.service';
import { Chapter } from './chapter.model';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { Links } from './links.model';

@Injectable()
export class LibraryService {
  constructor(
		@InjectModel(Chapter) private chapterReprository: typeof Chapter,
    @InjectModel(Links) private linksReprository: typeof Links,
    private documentsService: DocumentsService,
    private usersService: UsersService
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
      ], order: [
        ["id", "ASC"]
      ]})
      return chapters
    }

    async deleteChapterById(id: number) {
      const chapter = await this.chapterReprository.findByPk(id)
      if(chapter) 
        return await this.chapterReprository.destroy({where: {id: chapter.id}})
    }

    async updateLink(dto: CreateLinkDto, files: any) {
      const link = await this.linksReprository.findByPk(dto.id, {include: {all: true}})
      if(!link)
        throw new HttpException('Не удалось найти линк', HttpStatus.BAD_GATEWAY)

      link.name = dto.name
      await link.save()

      return await this.upCreateLink(dto, link, files)
    }

    private async upCreateLink(dto: CreateLinkDto, links: Links, files: any) {
      if(dto.description != 'null') links.description = dto.description
      else links.description = ''
      if(dto.link != 'null') links.link = dto.link
      else links.link = ''

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
          if(res && res.id) {
            const docId = await this.documentsService.getFileById(res.id)
            if(docId) await links.$add('documents', docId.id)
          }
          i++
        }
      }

      if(dto.chapter_id) {
        const chapter = await this.chapterReprository.findByPk(dto.chapter_id)
        if(chapter) 
          links.chapter_id = chapter.id
      }


      await links.save()
      const all_folter_links = await this.linksReprository.findByPk(links.id, {include: {all: true}})
      return all_folter_links
    }

    async createNewLinks(dto: CreateLinkDto, files: any) {
      const links = await this.linksReprository.create({name: dto.name})
      if(!links)
        throw new HttpException('Не удалось создать линк', HttpStatus.BAD_GATEWAY)
      
      const user = await this.linksReprository.findByPk(dto.user_id)
      if(user) 
        links.responsible_id = user.id

      return await this.upCreateLink(dto, links, files)
    }

    async getALlLinks() {
      return await this.linksReprository.findAll({include: {all: true}, order: ["id"]})
    }

    async toBanLinks(id: number) {
      const link = await this.linksReprository.findByPk(id)
      if(link) {
        link.ban = !link.ban
        await link.save()
        return link
      }
    }

    async addLinksToFavorite(user_id: number, links_id: number) {
      const user = await this.usersService.getUserByPk(user_id)
      const link = await this.linksReprository.findByPk(links_id, {include: {all: true}})

      if(user && link) {
        let check: boolean = true
        for(let usr of link.users) {
          if(usr.id == user.id) check = false
        }
        if(check) return await link.$add('users', user.id)
        else return await link.$remove('users', user.id)
      }


      throw new HttpException('Не удалось добавить в избранное или убрать из него', HttpStatus.BAD_GATEWAY)
    }
}
