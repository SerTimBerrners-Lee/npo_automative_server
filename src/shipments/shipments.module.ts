import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BuyerModule } from 'src/buyer/buyer.module';
import { ProductModule } from 'src/product/product.module';
import { ShipmentsController } from './shipments.controller';
import { Shipments } from './shipments.model';
import { ShipmentsService } from './shipments.service';

@Module({
	providers: [ShipmentsService],
	controllers: [ShipmentsController],
	imports: [
		SequelizeModule.forFeature([Shipments]),
		BuyerModule,
		ProductModule
	],

	exports: [ShipmentsService]
})
export class ShipmentsModule {}
