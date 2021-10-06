import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { UpCreateIssueDto } from './dto/up-create-issue.dto';
import { Issue } from './issue.model';

@Injectable()
export class IssueService {
	constructor(@InjectModel(Issue) private issueReprository: typeof Issue,
		private documentsService: DocumentsService) {}

	async createIssue(dto: UpCreateIssueDto, files: any) {
		let numberEndIssue = await this.issueReprository.findOne(
			{
				order: [
					['id', 'DESC']
				],
				limit: 1
			})
		let endIssue: any; 
		if(numberEndIssue && numberEndIssue.id) endIssue = numberEndIssue.id
		else endIssue = 1

		const issue = await this.issueReprository.create({name: String(endIssue), instans: 1}, {include: {all: true}})
		if(!issue) 
			throw new HttpException('Не удалось создать задание', HttpStatus.BAD_REQUEST)
		console.log('CREATED:', issue)

		if(dto.description != 'null') issue.description = dto.description
		else issue.description = ''
		if(dto.dateUse != 'null') issue.dateUse = dto.dateUse
		else issue.dateUse = ''
		if(dto.normTime != 'null') issue.normTime = dto.normTime
		else issue.normTime = ''
		if(dto.sourse != 'null') {
			issue.sourse = dto.sourse
			let responsible = JSON.parse(dto.sourse)
			if(responsible) issue.responsibleUserId = responsible.id
		}
		else issue.sourse = ''
		if(dto.srok != 'null') issue.srok = dto.srok
		else issue.srok = ''
		if(dto.status != 'null') issue.status = dto.status
		else issue.status = ''
		if(dto.izdList != 'null') issue.izdList = dto.izdList
		else issue.izdList = ''
		if(dto.shopNeeds != 'null') issue.shopNeeds = dto.shopNeeds
		else issue.shopNeeds = ''
		
		await issue.save()
		console.log(dto)

		if(issue.controllers && issue.controllers.length) {
			for(let controller of issue.controllers) {
				await issue.$remove('controllers', controller.id)
			}
		}

		if(issue.users && issue.users.length) {
			for(let executor of issue.users) {
				await issue.$remove('users', executor.id)
			}
		}

		issue.controllerList = ''
		if(dto.controllerList != 'null') {
			issue.controllerList = dto.controllerList
			let controllers = JSON.parse(dto.controllerList)
			for(let controller of controllers) {
				await issue.$add('controllers', controller.id)
			}
		}
		issue.executorList = ''
		if(dto.executorList != 'null') {
			issue.executorList = dto.executorList
			let executors = JSON.parse(dto.executorList)
			for(let executor of executors) {
				await issue.$add('users', executor.id)
			}
		}

		if(files.document) {
			for(let document of files.document) {
					let res = await this.documentsService.saveDocument(
							document, 
							'p', 
							'screen',
							'0.0.1',
					)
					if(res.id) {
							let docId = await this.documentsService.getFileById(res.id)
							await issue.$add('documents', docId.id)
					}
			}
		}

		await issue.save()
		console.log(issue)

		return issue
	}
}
