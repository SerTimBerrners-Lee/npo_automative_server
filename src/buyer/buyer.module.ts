import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Documents } from 'src/documents/documents.model';
import { DocumentsModule } from 'src/documents/documents.module';
import { BuyerController } from './buyer.controller';
import { Buyer } from './buyer.model';
import { BuyerService } from './buyer.service';
import { Purchases } from './purchases.model';

@Module({
    controllers: [BuyerController],
    providers: [BuyerService],
    imports: [
        SequelizeModule.forFeature([
            Buyer,
            Purchases,
            Documents
        ]),
        DocumentsModule
    ],
    exports: [BuyerModule]
})
export class BuyerModule {}
