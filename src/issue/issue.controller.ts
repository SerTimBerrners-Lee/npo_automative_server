import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpCreateIssueDto } from './dto/up-create-issue.dto';
import { IssueService } from './issue.service';

@ApiTags('Задачи')
@Controller('issue')
export class IssueController {

	constructor(private issueService: IssueService) {}

	@ApiOperation({summary: 'Создание пользователей'})
	@Post()
	@UseInterceptors(FileFieldsInterceptor([
			{name: 'document', maxCount: 20}
	]))
	createUser(
			@Body() dto: UpCreateIssueDto, 
			@UploadedFiles() files: { document?: Express.Multer.File[]}) {
			return this.issueService.createIssue(dto, files)
	}
}
 