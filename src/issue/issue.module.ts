import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsModule } from 'src/documents/documents.module';
import { FilesModule } from 'src/files/files.module';
import { IssueController } from './issue.controller';
import { Issue } from './issue.model';
import { IssueService } from './issue.service';

@Module({
    controllers: [IssueController],
    providers: [IssueService],
    imports: [
        SequelizeModule.forFeature([
            Issue
        ]),
        DocumentsModule
    ]
})
export class IssueModule {}
