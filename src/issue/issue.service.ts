import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsService } from 'src/documents/documents.service';
import { DateMethods } from 'src/files/date.methods';
import { UpCreateIssueDto } from './dto/up-create-issue.dto';
import { Issue } from './issue.model';

@Injectable()
export class IssueService {
	constructor(@InjectModel(Issue) private issueReprository: typeof Issue,
		private documentsService: DocumentsService) {}

	async createIssue(dto: UpCreateIssueDto, files: any) {
		const endndIssue = await this.issueReprository.findOne(
			{
				order: [
					['id', 'DESC']
				],
				limit: 1
			})
		const dm = new DateMethods
		const numberEndIssue = endndIssue && endndIssue.id ?  
			`№${endndIssue.id + 1} от ${dm.date()}` : `№1 от ${dm.date()}`

		const newIssue = await this.issueReprository.create({name: String(numberEndIssue), instans: 1})
		if(!newIssue) 
			throw new HttpException('Не удалось создать задание', HttpStatus.BAD_REQUEST)
		const issue = await this.issueReprository.findByPk(newIssue.id, {include: {all: true}})
		
		return await this.upCreateIssue(dto, files, issue)

	}

	async updateIssue(dto: UpCreateIssueDto, files: any) {
		const issue = await this.issueReprository.findByPk(dto.id, {include: {all: true}})
		if(!issue) 
			throw new HttpException('Не удалось найти задание для обновления', HttpStatus.BAD_REQUEST)

		return await this.upCreateIssue(dto, files, issue);

	}

	private async upCreateIssue(dto: UpCreateIssueDto, files: any, issue: Issue) {
		if(dto.description != 'null') issue.description = dto.description
		else issue.description = ''
		if(dto.dateUse != 'null') issue.dateUse = dto.dateUse
		else issue.dateUse = ''
		if(dto.normTime != 'null') issue.normTime = dto.normTime
		else issue.normTime = ''
		if(dto.sourse != 'null') {
			issue.sourse = dto.sourse
			try {
				let responsible = JSON.parse(dto.sourse)
				if(responsible) issue.responsibleUserId = responsible.id
			} catch(e) {
				console.log(e, "ERROR")
			}
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
		if(dto.srok_control != 'null') issue.srok_control = dto.srok_control
		else issue.srok_control = ''
		
		await issue.save()

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
		console.log(dto)

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

		if(dto.fileArrModal !='null') {
			let files = JSON.parse(dto.fileArrModal)
			for(let file of files) {
				let check = await this.documentsService.getFileById(file.id)
				if(check)
					await issue.$add('documents', check.id)
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
		return issue

	}

	async getAllIssues() {
		return await this.issueReprository.findAll({include: {all: true}})
	}
}
