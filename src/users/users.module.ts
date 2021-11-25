import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Avatars } from 'src/avatars/avatars.model';
import { DocumentsUser } from 'src/documents/documents-user.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { FilesModule } from 'src/files/files.module';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, DocumentsUser, Avatars]),
    RolesModule,
    DocumentsModule,
    FilesModule, 
    forwardRef(() => AuthModule )
  ],
  exports: [
    UsersService
  ]
})

export class UsersModule {}
