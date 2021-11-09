import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chapter } from './chapter.model';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Injectable()
export class LibraryService {
  constructor(
		@InjectModel(Chapter) private chapterReprository: typeof Chapter,
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
      return await this.chapterReprository.findAll()
    }

    async deleteChapterById(id: number) {
      const chapter = await this.chapterReprository.findByPk(id)
      if(chapter) 
        return await this.chapterReprository.destroy({where: {id: chapter.id}})
    }

}
