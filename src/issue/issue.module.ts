import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IssueController } from './issue.controller';
import { Issue } from './issue.model';
import { IssueService } from './issue.service';

@Module({
    controllers: [IssueController],
    providers: [IssueService],
    imports: [
        SequelizeModule.forFeature([
            Issue
        ])
    ]
})
export class IssueModule {}
