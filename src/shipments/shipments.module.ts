import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BuyerModule } from 'src/buyer/buyer.module';
import { CbedModule } from 'src/cbed/cbed.module';
import { DetalModule } from 'src/detal/detal.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { ProductModule } from 'src/product/product.module';
import { SettingsModule } from 'src/settings/settings.module';
import { ShipmentsController } from './shipments.controller';
import { Shipments } from './shipments.model';
import { ShipmentsService } from './shipments.service';

@Module({
	providers: [ShipmentsService],
	controllers: [ShipmentsController],
	imports: [
		SequelizeModule.forFeature([Shipments]),
		BuyerModule,
		ProductModule,
		CbedModule,
		DetalModule,
		SettingsModule,
		DocumentsModule
	],

	exports: [ShipmentsService]
})
export class ShipmentsModule {}
