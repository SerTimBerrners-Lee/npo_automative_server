import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChapterDto } from './dto/create-chapter.dto';
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
		console.log(dto)
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
}
