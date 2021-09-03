import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { DocumentsUser } from './documents-user.model';
import { DocumentsController } from './documents.controller';
import { Documents } from './documents.model';
import { DocumentsService } from './documents.service';

@Module({
    providers: [DocumentsService],
    controllers: [DocumentsController],
    imports: [
        SequelizeModule.forFeature([Documents, User, DocumentsUser]),
        forwardRef(() => UsersModule)
    ],
    exports: [
        DocumentsService
    ]
})
export class DocumentsModule {}
