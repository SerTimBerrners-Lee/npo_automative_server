import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { LibraryService } from './library.service';

@ApiTags('Библиотека')
@Controller('library')
export class LibraryController {
  constructor(private libraryServices: LibraryService) {}


  @ApiOperation({summary: 'Создаем Раздел Библиотеки'})
	@Post('/chapter')
	createNewChapter(@Body() dto: CreateChapterDto) {
    return this.libraryServices.createNewChapter(dto)
	}

	@ApiOperation({summary: 'Обновляем Раздел Библиотеки'})
	@Put('/chapter')
	updateChapter(@Body() dto: CreateChapterDto) {
    return this.libraryServices.updateChapter(dto)
	}

	@ApiOperation({summary: 'Получаем все разделы библиотеки'})
	@Get('/chapter')
	getAllChapter() {
		return this.libraryServices.getAllChapter()
	}

  @ApiOperation({summary: 'Удаляем раздел библиотеки'})
	@Delete('/chapter/:id')
	deleteChapterById(@Param('id') id: number) {
    return this.libraryServices.deleteChapterById(id)
	}

	@ApiOperation({summary: 'Создаем Навую линк'})
	@Post('/links')
	@UseInterceptors(FileFieldsInterceptor([
		{name: 'document', maxCount: 40}
	]))
	createNewLinks(@Body() dto: CreateLinkDto, 
		@UploadedFiles() files: { document?: Express.Multer.File[]} ) {
    return this.libraryServices.createNewLinks(dto, files)
	}

	@ApiOperation({summary: 'Получаем все линки'})
	@Get('/links')
	getALlLinks() {
		return this.libraryServices.getALlLinks()
	}

	@ApiOperation({summary: 'Добавляем в бан по id '})
	@Delete('/links/:id')
	toBanLinks(@Param('id') id: number) {
		return this.libraryServices.toBanLinks(id)
	}
}
